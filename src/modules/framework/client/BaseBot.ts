import type { ClientOptions, CommandInteraction } from 'discord.js';
import { Client, Collection } from 'discord.js';
import DirectoryMapper from '../io/DirectoryMapper';
import CommandResolver from '../commands/loaders/CommandResolver';
import type { resolvedClass } from '../io/ClassResolver';
import type ClassResolver from '../io/ClassResolver';
import type IBot from './IBot';
import type BaseCommand from '../commands/BaseCommand';
import type ICommandRunResponse from './ICommandRunResponse';
import consola from 'consola';
import type IBotDevInformation from './IBotDevInformation';
import type DirectoryMapperFactory from '../io/DirectoryMapperFactory';
import path from 'path';
import fsSync from 'fs';
import SubCommandResolver from '../commands/loaders/SubCommandResolver';
import type SubCommand from '../commands/SubCommand';
import OwnerPrecondition from '../commands/preconditions/OwnerPrecondition';
import type IHasPreconditions from '../commands/preconditions/interfaces/IHasPreconditions';
import type ICommand from '../commands/interfaces/ICommand';
import type SubCommandGroup from '../commands/SubCommandGroup';
import SubCommandGroupResolver from '../commands/loaders/SubCommandGroupResolver';
import fs from 'fs/promises';
import { SetupPrecondition } from '../commands/decorators/PreconditionDecorators';
import RequiresSubCommandsPrecondition from '../commands/preconditions/RequiresSubCommandsPrecondition';
import RequiresSubCommandsGroupsPrecondition from '../commands/preconditions/RequiresSubCommandsGroupsPrecondition';
import type ICommandContext from '../commands/interfaces/ICommandContext';
import type IDevOptions from './IBotDevOptions';
import { assertDefined } from '../types/TypeAssertions';
import type Constructor from '../interfaces/Constructor';

export default abstract class BaseBot<CTX extends ICommandContext>
  extends Client
  implements IBot
{
  public readonly commands: Collection<string, BaseCommand<CTX>> =
    new Collection();

  public readonly subCommands: Collection<
    ICommand<CTX> | SubCommandGroup,
    SubCommand<CTX>[]
  > = new Collection();

  public readonly subCommandGroups: Collection<
    ICommand<CTX>,
    SubCommandGroup[]
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
    const commandResolver = new CommandResolver<CTX>(...this.commandMappers);
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
    C extends ICommand<CTX> | SubCommandGroup,
    S extends ICommand<CTX> | SubCommandGroup
  >(
    commandRes: resolvedClass<C>,
    pathName: string,
    collection: Collection<ICommand<CTX> | SubCommandGroup, S[]>,
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
      if (!interaction.isCommand()) return;

      const command = this.commands.get(interaction.commandName);
      if (!command) {
        await this.onCommandNotFound(interaction);
        return;
      }

      const verifyIsHasPreconditions = (
        command: unknown
      ): command is IHasPreconditions<CTX> => {
        return (command as IHasPreconditions).preconditions !== undefined;
      };

      const baseCommandHasPreconditions = verifyIsHasPreconditions(command);
      const verifyNeedsSubCommandOrGroup = (
        preconditionClass: Constructor<
          [],
          | RequiresSubCommandsPrecondition
          | RequiresSubCommandsGroupsPrecondition
        >
      ): boolean => {
        return baseCommandHasPreconditions
          ? Boolean(
              command.preconditions.find((p) => p instanceof preconditionClass)
            )
          : false;
      };

      const subCommandOption = interaction.options.getSubcommand(
        verifyNeedsSubCommandOrGroup(RequiresSubCommandsPrecondition)
      );

      const subCommandGroupOption = interaction.options.getSubcommandGroup(
        verifyNeedsSubCommandOrGroup(RequiresSubCommandsGroupsPrecondition)
      );

      let groupToRunSubcommand: ICommand<CTX> | SubCommandGroup = command;
      let runnerCommand: ICommand<CTX> = command;

      const getCommandOrSubCommand = <
        C extends ICommand<CTX> | SubCommandGroup
      >(
        collection: Collection<ICommand<CTX> | SubCommandGroup, C[]>,
        command: ICommand<CTX> | SubCommandGroup,
        option: string
      ): C | undefined => {
        return collection
          .get(command)
          ?.find((o) => o.information.name === option);
      };

      if (subCommandGroupOption) {
        groupToRunSubcommand =
          getCommandOrSubCommand(
            this.subCommandGroups,
            command,
            subCommandGroupOption
          ) ?? groupToRunSubcommand;
      }

      if (subCommandOption) {
        const subCommand = getCommandOrSubCommand(
          this.subCommands,
          groupToRunSubcommand,
          subCommandOption
        );
        if (subCommand) {
          runnerCommand = subCommand;
        } else {
          await this.onSubCommandNotFound(interaction);
          return;
        }
      }

      const context = runnerCommand.createContext({
        interaction,
        client: this,
      });

      await context.build();

      const canRunCommand = async (
        command: ICommand<CTX> | SubCommandGroup
      ): Promise<boolean> => {
        return verifyIsHasPreconditions(command)
          ? await this.verifyPreconditions(command, context)
          : true;
      };

      const canRunSubCommandOrGroup = async (
        inner: ICommand<CTX> | SubCommandGroup
      ): Promise<boolean> => {
        return inner === command ? true : await canRunCommand(inner);
      };

      if (!(await canRunCommand(command))) return;

      if (!(await canRunSubCommandOrGroup(groupToRunSubcommand))) return;

      if (!(await canRunSubCommandOrGroup(runnerCommand))) return;

      const response: ICommandRunResponse<CTX> = {
        context,
        command: runnerCommand,
      };

      await this.beforeCommandRun(response);

      await runnerCommand.trigger(context);

      await this.onCommandRun(response);
    });
  }

  private async verifyPreconditions(
    preconditioned: IHasPreconditions<CTX>,
    context: CTX
  ): Promise<boolean> {
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

  public async onCommandNotFound(
    interaction: CommandInteraction
  ): Promise<void> {
    assertDefined(interaction.command);
    consola.log(`Couldn't find command: ${interaction.command.name}`);
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
