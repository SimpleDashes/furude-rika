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
import GuildPermissionsPreconditions from '../commands/preconditions/GuildPermissionsPreconditions';
import { initOwnerPrecondition } from '../commands/decorators/PreconditionDecorators';
import IRunsCommand from '../commands/interfaces/IRunsCommand';
import ICommand from '../commands/interfaces/ICommand';
import CommandGroup from '../commands/CommandGroup';
import SubCommandGroupResolver from '../io/object_resolvers/command_resolvers/SubCommandGroupResolver';
import fs from 'fs/promises';
export default abstract class BaseBot extends Client implements IBot {
  public readonly commands: Collection<string, BaseCommand<BaseBot>> =
    new Collection();

  public readonly subCommands: Collection<
    ICommand<BaseBot, any>,
    SubCommand<BaseBot>[]
  > = new Collection();

  public readonly subGroups: Collection<
    BaseCommand<BaseBot>,
    CommandGroup<BaseBot>[]
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
    subCommandsDirectory: string = 'subcommands',
    subCommandGroupsDirectory: string = 'groups',
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
    initOwnerPrecondition(new OwnerPrecondition(this.devInfo.ownerIds));
  }

  private async loadCommands() {
    if (this.commandMapperFactory) {
      const newMappers = await this.commandMapperFactory.buildMappers();
      this.commandMappers.push(...newMappers);
    }
    const commandResolver = new CommandResolver(...this.commandMappers);
    const resolvedCommands = await commandResolver.getAllObjects();
    for await (const commandRes of resolvedCommands) {
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
        this.subGroups,
        (mapper: DirectoryMapper) => new SubCommandGroupResolver(mapper),
        async (res, command, group) => {
          command.addSubcommandGroup(group);
          await this.registerSubOrGroup(
            res,
            this.subCommandGroupsDirectory,
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
    C extends ICommand<BaseBot, any>,
    S extends ICommand<BaseBot, any>
  >(
    commandRes: resolvedClass<C>,
    pathName: string,
    collection: Collection<ICommand<BaseBot, any>, S[]>,
    resolver: (mapper: DirectoryMapper) => ClassResolver<any>,
    manipulator?: (
      res: resolvedClass<S>,
      command: C,
      subOrGroup: S
    ) => Promise<void>
  ) {
    const subOrGroupPath = path.join(commandRes.directory.path, pathName);

    if (fsSync.existsSync(subOrGroupPath)) {
      const dir = await fs.readdir(subOrGroupPath, {
        withFileTypes: true,
      });

      for await (const file of dir) {
        if (file.isDirectory()) {
          pathName = path.join(pathName, file.name);
          await this.registerSubOrGroup(
            commandRes,
            pathName,
            collection,
            resolver,
            manipulator
          );
        }
      }

      const mapper = new DirectoryMapper(subOrGroupPath);
      const subOrGroupsResolverCommandResolver = resolver(mapper);
      const resolvedSubOrGroups =
        await subOrGroupsResolverCommandResolver.getAllObjects();
      const subOrGroups = resolvedSubOrGroups.map((res) => res.object);

      for await (const res of resolvedSubOrGroups) {
        if (manipulator) await manipulator(res, commandRes.object, res.object);
      }

      collection.set(commandRes.object, subOrGroups);
    }
  }

  async start() {
    await this.login(this.devInfo.token);

    const developmentGuildID =
      process.env[this.devOptions.ENV_DEVELOPMENT_SERVER];

    this.on('ready', async (_client: Client) => {
      if (developmentGuildID) {
        this.devInfo.developmentGuild = await this.guilds.fetch(
          developmentGuildID
        );
        consola.success(`Development Guild: ${this.devInfo.developmentGuild}`);
      }
      await this.loadCommands();
    });

    this.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand) return;

      if (!(interaction instanceof CommandInteraction)) return;

      const command = this.commands.get(interaction.commandName);

      if (!command) return;

      const preconditioned = command as unknown as Partial<IHasPreconditions>;

      const subCommandOption = interaction.options.getSubcommand(
        !!preconditioned.requiresSubCommands
      );

      const subGroupOption = interaction.options.getSubcommandGroup(
        !!preconditioned.requiresSubGroups
      );

      let runner: IRunsCommand<BaseBot> | null = null;
      let forSubCommandGroup: ICommand<any, any> = command;

      if (subGroupOption) {
        const gotGroup = this.subGroups
          .get(command)
          ?.find((group) => group.name == subGroupOption);
        if (gotGroup) {
          forSubCommandGroup = gotGroup;
        }
      }

      if (subCommandOption) {
        const runnableSubCommand = this.subCommands
          .get(forSubCommandGroup)
          ?.find((sub) => sub.name == subCommandOption);
        if (runnableSubCommand) {
          runner = await runnableSubCommand.createRunner(interaction);
        } else {
          await this.onSubCommandNotFound(interaction);
          return;
        }
      } else {
        runner = await command.createRunner(interaction);
      }

      if (runner) {
        if (
          !(await this.verifyPermissionsToRunCommand(runner, preconditioned))
        ) {
          return;
        }

        if (runner.run) {
          await runner.run();
          this.onCommandRun({
            interaction,
            command: command,
          });
        }
      }
    });
  }

  /**
   * @returns wether the user has enough permissions to execute said command
   */
  private async verifyPermissionsToRunCommand(
    runner: IRunsCommand<BaseBot>,
    preconditioned: Partial<IHasPreconditions>
  ): Promise<boolean> {
    const { interaction } = runner;
    if (preconditioned?.preconditions) {
      for (const precondition of preconditioned.preconditions) {
        if (!precondition.validate(interaction)) {
          if (runner.onInsufficientPermissions) {
            if (precondition instanceof OwnerPrecondition) {
              await runner.onInsufficientPermissions(precondition);
            } else if (precondition instanceof GuildPermissionsPreconditions) {
              await runner.onInsufficientPermissions(
                precondition,
                precondition.requiredPermissions
              );
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  public async onCommandsLoaded(): Promise<void> {}

  public async onSubCommandNotFound(
    interaction: CommandInteraction
  ): Promise<void> {
    consola.log(
      `Couldn't find subcommand: ${interaction.options.getSubcommand()}`
    );
  }

  public onCommandRun(response: ICommandRunResponse) {
    consola.log(`${response.command} command was ran!`);
  }
}
