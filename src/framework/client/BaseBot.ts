import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
} from 'discord.js';
import DirectoryMapper from '../io/DirectoryMapper';
import CommandResolver from '../io/object_resolvers/command_resolvers/CommandResolver';
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
import { initPreconditions } from '../commands/decorators/PreconditionDecorators';
import IRunsCommand from '../commands/interfaces/IRunsCommand';

export default abstract class BaseBot extends Client implements IBot {
  public readonly commands: Collection<string, BaseCommand<BaseBot>> =
    new Collection();
  public readonly subCommands: Collection<
    BaseCommand<BaseBot>,
    SubCommand<BaseBot>[]
  > = new Collection();
  public readonly commandMappers: DirectoryMapper[] = [];
  public readonly devInfo: IBotDevInformation;
  public readonly devOptions: IDevOptions;
  private readonly commandMapperFactory?: DirectoryMapperFactory;
  private readonly subCommandsDirectory: string;

  public constructor(
    options: ClientOptions,
    devOptions: IDevOptions,
    commandMapperFactory?: DirectoryMapperFactory,
    subCommandsDirectory: string = 'subcommands',
    ...commandMappers: DirectoryMapper[]
  ) {
    super(options);
    this.subCommandsDirectory = subCommandsDirectory;
    this.devOptions = devOptions;
    this.commandMappers = commandMappers;
    this.commandMapperFactory = commandMapperFactory;
    this.devInfo = {
      ownerIds: this.devOptions.OWNER_IDS,
      token: process.env[this.devOptions.ENV_TOKEN_VAR],
    };
    initPreconditions(new OwnerPrecondition(this.devInfo.ownerIds));
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
      const subCommandPath = path.join(
        commandRes.directory.path,
        this.subCommandsDirectory
      );
      if (fsSync.existsSync(subCommandPath)) {
        const subCommandsMapper = new DirectoryMapper(subCommandPath);
        const subCommandResolver = new SubCommandResolver(subCommandsMapper);
        const resolvedSubCommands = await subCommandResolver.getAllObjects();
        const subCommands = [];

        for await (const subCommandRes of resolvedSubCommands) {
          commandRes.object.addSubcommand(subCommandRes.object);
          subCommands.push(subCommandRes.object);
        }

        this.subCommands.set(commandRes.object, subCommands);
      }
    }
    await this.onCommandsLoaded();
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

      let runner: IRunsCommand<BaseBot>;

      if (subCommandOption) {
        const runnableSubCommand = this.subCommands
          .get(command)
          ?.find((sub) => sub.name == subCommandOption);
        if (runnableSubCommand) {
          runner = runnableSubCommand.createRunner(interaction);
        } else {
          await this.onSubCommandNotFound(interaction);
        }
        return;
      } else {
        runner = command.createRunner(interaction);
      }

      if (!(await this.verifyPermissionsToRunCommand(runner, preconditioned))) {
        return;
      }

      if (runner.run) {
        await runner.run();
        this.onCommandRun({
          interaction,
          command: command,
        });
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
