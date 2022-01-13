import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
} from 'discord.js';
import DirectoryMapper from '../io/DirectoryMapper';
import CommandResolver from '../io/object_resolvers/command_resolvers/CommandResolver';
import type { resolvedClass } from '../io/object_resolvers/ClassResolver';
import ClassResolver from '../io/object_resolvers/ClassResolver';
import IBot from './IBot';
import BaseCommand from '../commands/BaseCommand';
import ICommandRunResponse from './ICommandRunResponse';
import consola from 'consola';
import IBotDevInformation from './IBotDevInformation';
import DirectoryMapperFactory from '../io/DirectoryMapperFactory';
import path from 'path';
import fsSync from 'fs';
import SubCommandResolver from '../io/object_resolvers/command_resolvers/SubCommandResolver';
import SubCommand from '../commands/SubCommand';
import OwnerPrecondition from '../commands/preconditions/OwnerPrecondition';
import IHasPreconditions from '../commands/preconditions/interfaces/IHasPreconditions';
import ICommand from '../commands/interfaces/ICommand';
import SubCommandGroup from '../commands/SubCommandGroup';
import SubCommandGroupResolver from '../io/object_resolvers/command_resolvers/SubCommandGroupResolver';
import fs from 'fs/promises';
import { SetupPrecondition } from '../commands/decorators/PreconditionDecorators';
import RequiresSubCommandsPrecondition from '../commands/preconditions/RequiresSubCommandsPrecondition';
import RequiresSubCommandsGroupsPrecondition from '../commands/preconditions/RequiresSubCommandsGroupsPrecondition';
import ICommandContext from '../commands/interfaces/ICommandContext';
import IDevOptions from './IBotDevOptions';
import { assertDefined } from '../types/TypeAssertions';

export default abstract class BaseBot<CTX extends ICommandContext>
  extends Client
  implements IBot
{
  public readonly commands: Collection<string, BaseCommand<CTX>> =
    new Collection();

  public readonly subCommands: Collection<ICommand<CTX>, SubCommand<CTX>[]> =
    new Collection();

  public readonly subCommandGroups: Collection<
    BaseCommand<CTX>,
    SubCommandGroup<CTX>[]
  > = new Collection();

  public readonly commandMappers: DirectoryMapper[] = [];
  public readonly devInfo: IBotDevInformation;
  public readonly devOptions: IDevOptions;
  private readonly commandMapperFactory?: DirectoryMapperFactory;
  private readonly subCommandsDirectory: string;
  private readonly subCommandGroupsDirectory: string;

  public constructor(
    options: ClientOptions,
    devOptions: IDevOptions,
    commandMapperFactory?: DirectoryMapperFactory,
    subCommandsDirectory = 'subcommands',
    subCommandGroupsDirectory = 'groups',
    ...commandMappers: DirectoryMapper[]
  ) {
    super(options);
    this.subCommandsDirectory = subCommandsDirectory;
    this.subCommandGroupsDirectory = subCommandGroupsDirectory;
    this.devOptions = devOptions;
    this.commandMappers = commandMappers;
    this.commandMapperFactory = commandMapperFactory;
    this.devInfo = {
      ownerIds: this.devOptions.OWNER_IDS,
      token: process.env[this.devOptions.ENV_TOKEN_VAR],
    };
    SetupPrecondition.setup(new OwnerPrecondition(this.devInfo.ownerIds));
  }

  private async loadCommands(): Promise<void> {
    if (this.commandMapperFactory) {
      const newMappers = await this.commandMapperFactory.buildMappers();
      this.commandMappers.push(...newMappers);
    }
    const commandResolver = new CommandResolver(...this.commandMappers);
    const resolvedCommands = await commandResolver.getAllObjects();
    for (const commandRes of resolvedCommands) {
      this.commands.set(commandRes.object.name, commandRes.object);

      await this.registerSubOrGroup(
        commandRes,
        this.subCommandsDirectory,
        this.subCommands,
        (mapper: DirectoryMapper) => new SubCommandResolver(mapper),
        async (_res, command, sub) => {
          command.addSubcommand(sub);
        }
      );

      await this.registerSubOrGroup(
        commandRes,
        this.subCommandGroupsDirectory,
        this.subCommandGroups,
        (mapper: DirectoryMapper) => new SubCommandGroupResolver(mapper),
        async (res, command, group) => {
          command.addSubcommandGroup(group);
          await this.registerSubOrGroup(
            res,
            this.subCommandsDirectory,
            this.subCommands,
            (mapper: DirectoryMapper) => new SubCommandResolver(mapper),
            async (_res, command, sub) => {
              command.addSubcommand(sub);
            }
          );
        }
      );
    }
    await this.onCommandsLoaded();
  }

  private async registerSubOrGroup<
    C extends ICommand<CTX>,
    S extends ICommand<CTX>
  >(
    commandRes: resolvedClass<C>,
    pathName: string,
    collection: Collection<ICommand<CTX>, S[]>,
    resolver: (mapper: DirectoryMapper) => ClassResolver<S>,
    manipulator?: (
      res: resolvedClass<S>,
      command: C,
      subOrGroup: S
    ) => Promise<void>,
    selectedDirectoryBase: string = pathName
  ): Promise<void> {
    const subOrGroupPath = path.join(commandRes.directory.path, pathName);

    if (fsSync.existsSync(subOrGroupPath)) {
      const dir = await fs.readdir(subOrGroupPath, {
        withFileTypes: true,
      });
      for (const file of dir) {
        if (file.isDirectory()) {
          const dirPathName = path.join(pathName, file.name);
          if (
            (selectedDirectoryBase === this.subCommandGroupsDirectory &&
              !dirPathName.endsWith(this.subCommandsDirectory)) ||
            selectedDirectoryBase === this.subCommandsDirectory
          ) {
            await this.registerSubOrGroup(
              commandRes,
              dirPathName,
              collection,
              resolver,
              manipulator,
              selectedDirectoryBase
            );
          }
        }
      }

      const mapper = new DirectoryMapper(subOrGroupPath);
      const subOrGroupsResolverCommandResolver = resolver(mapper);
      const resolvedSubOrGroups =
        await subOrGroupsResolverCommandResolver.getAllObjects();
      const subOrGroups = resolvedSubOrGroups.map((res) => res.object);

      for (const res of resolvedSubOrGroups) {
        if (manipulator) await manipulator(res, commandRes.object, res.object);
      }

      const command = collection.get(commandRes.object);
      if (command) {
        command.push(...subOrGroups);
      } else {
        collection.set(commandRes.object, subOrGroups);
      }
    }
  }

  public async start(): Promise<void> {
    await this.login(this.devInfo.token);

    const developmentGuildID =
      process.env[this.devOptions.ENV_DEVELOPMENT_SERVER];

    this.on('ready', async () => {
      if (developmentGuildID) {
        this.devInfo.developmentGuild = await this.guilds.fetch(
          developmentGuildID
        );
        consola.success(`Development Guild: ${this.devInfo.developmentGuild}`);
      }
      await this.loadCommands();
    });

    this.on('interactionCreate', async (interaction) => {
      if (
        !interaction.isCommand ||
        !(interaction instanceof CommandInteraction) ||
        !this.commands.has(interaction.commandName)
      )
        return;

      const command = this.commands.get(interaction.commandName);

      if (!command) return;

      const commandWithPreconditions = command as unknown as IHasPreconditions &
        BaseCommand<CTX>;

      const subCommandOption = interaction.options.getSubcommand(
        Boolean(
          commandWithPreconditions.preconditions?.find(
            (p) => p instanceof RequiresSubCommandsPrecondition
          )
        )
      );

      const subCommandGroupOption = interaction.options.getSubcommandGroup(
        Boolean(
          commandWithPreconditions.preconditions?.find(
            (p) => p instanceof RequiresSubCommandsGroupsPrecondition
          )
        )
      );

      let groupToRunSubcommand: ICommand<CTX> = command;
      let runnerCommand: ICommand<CTX> = command;

      if (subCommandGroupOption) {
        const subCommandGroup = this.subCommandGroups
          .get(command)
          ?.find((group) => group.name === subCommandGroupOption);
        if (subCommandGroup) {
          groupToRunSubcommand = subCommandGroup;
        }
      }

      if (subCommandOption) {
        const runnableSubCommand = this.subCommands
          .get(groupToRunSubcommand)
          ?.find((sub) => sub.name === subCommandOption);
        if (runnableSubCommand) {
          runnerCommand = runnableSubCommand;
        } else {
          await this.onSubCommandNotFound(interaction);
          return;
        }
      }

      const context = runnerCommand.createContext({
        interaction,
        client: this,
      }) as CTX;

      await context.build();

      const canRunCommand = async (
        command: ICommand<CTX> | (ICommand<CTX> & IHasPreconditions)
      ): Promise<boolean> => {
        return await this.verifyPreconditions(
          command as IHasPreconditions,
          context
        );
      };

      const canRunSubCommandOrGroup = async (
        inner: ICommand<CTX>
      ): Promise<boolean> => {
        return inner === commandWithPreconditions
          ? true
          : await canRunCommand(inner);
      };

      if (!(await canRunCommand(commandWithPreconditions))) return;

      if (!(await canRunSubCommandOrGroup(groupToRunSubcommand))) return;

      if (!(await canRunSubCommandOrGroup(runnerCommand))) return;

      const response = {
        context,
        command: runnerCommand,
      };

      await this.beforeCommandRun(response);

      await runnerCommand.trigger(context);

      await this.onCommandRun(response);
    });
  }

  private async verifyPreconditions(
    preconditioned: IHasPreconditions,
    context: CTX
  ): Promise<boolean> {
    if (!preconditioned.preconditions) return true;

    for (const precondition of preconditioned.preconditions) {
      if (!(await precondition.validate(context))) {
        return false;
      }
    }

    return true;
  }

  public async onCommandsLoaded(): Promise<void> {
    /**
     *
     */
  }

  public async onSubCommandNotFound(
    interaction: CommandInteraction
  ): Promise<void> {
    consola.log(
      `Couldn't find subcommand: ${interaction.options.getSubcommand()}`
    );
  }

  public async beforeCommandRun(
    response: ICommandRunResponse<CTX>
  ): Promise<void> {
    assertDefined(response);
    /**
     *
     */
  }

  public async onCommandRun(response: ICommandRunResponse<CTX>): Promise<void> {
    consola.log(`${response.command} command was ran!`);
  }
}
