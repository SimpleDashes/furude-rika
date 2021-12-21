import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import DirectoryMapper from '../io/DirectoryMapper';
import CommandResolver from '../io/object_resolvers/CommandResolver';
import IBot from './IBot';
import BaseCommand from '../commands/BaseCommand';
import ICommandRunResponse from './ICommandRunResponse';
import consola from 'consola';
import IBotDevInformation from './IBotDevInformation';
import DirectoryMapperFactory from '../io/DirectoryMapperFactory';
import path from 'path';
import fs from 'fs/promises';
export default abstract class BaseBot extends Client implements IBot {
  public readonly commands: Collection<string, BaseCommand<BaseBot>> =
    new Collection();
  public readonly commandMappers: DirectoryMapper[] = [];
  public readonly devInfo: IBotDevInformation;
  public readonly devOptions: IDevOptions;
  private readonly commandMapperFactory?: DirectoryMapperFactory;
  private readonly subCommandsDirectory: string;
  private onCommandsLoaded?: () => void;

  public constructor(
    options: ClientOptions,
    devOptions: IDevOptions,
    onCommandsLoaded?: () => void,
    commandMapperFactory?: DirectoryMapperFactory,
    subCommandsDirectory: string = 'subcommands',
    ...commandMappers: DirectoryMapper[]
  ) {
    super(options);
    this.subCommandsDirectory = subCommandsDirectory;
    this.devOptions = devOptions;
    this.commandMappers = commandMappers;
    this.commandMapperFactory = commandMapperFactory;
    this.onCommandsLoaded = onCommandsLoaded;
    this.devInfo = {
      ownerIds: this.devOptions.OWNER_IDS,
      token: process.env[this.devOptions.ENV_TOKEN_VAR],
    };
  }

  private async loadCommands() {
    if (this.commandMapperFactory) {
      const newMappers = await this.commandMapperFactory.buildMappers();
      this.commandMappers.push(...newMappers);
    }
    const commandResolver = new CommandResolver(...this.commandMappers);
    await commandResolver.getAllObjects().then(async (res) => {
      for await (const commandRes of res) {
        this.commands.set(commandRes.object.name, commandRes.object);
        const subCommandsMapper = new DirectoryMapper(
          path.join(commandRes.directory.path, this.subCommandsDirectory)
        );
        const subCommandsFile = await fs.readFile(subCommandsMapper.path);
        // TODO: IMPLEMENT SUBCOMMANDS
      }
      if (this.onCommandsLoaded) this.onCommandsLoaded();
    });
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

      if (command.information.ownerOnly) {
        if (!this.devInfo.ownerIds.includes(interaction.user.id)) {
          await command.onInsufficientPermissions(this, interaction);
          return;
        }
      }

      if (interaction.guild) {
        if (command.information.permissions) {
          if (
            !(interaction.member as GuildMember).permissions.has(
              command.information.permissions
            )
          ) {
            command.onInsufficientPermissions(
              this,
              interaction,
              command.information.permissions
            );
            return;
          }
        }
      }

      await command.run(this, interaction);
      this.onCommandRun({
        interaction,
        command: command,
      });
    });
  }

  onCommandRun(response: ICommandRunResponse) {
    consola.log(`${response.command} command was ran!`);
  }
}
