import { CommandInteraction, Intents } from 'discord.js';
import BaseBot from '../modules/framework/client/BaseBot';
import consola from 'consola';
import ICommandRunResponse from '../modules/framework/client/ICommandRunResponse';
import DeployHandler from '../modules/framework/rest/DeployHandler';
import DirectoryMapperFactory from '../modules/framework/io/DirectoryMapperFactory';
import path from 'path';
import FurudeLocales from '../localization/FurudeLocales';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';
import FurudeDB from '../database/FurudeDB';
import DefaultContext from './contexts/DefaultContext';
import FurudeOperations from '../database/FurudeOperations';
import ReminderManager from './managers/ReminderManager';
import UserScanner from './managers/UserScanner';
import OsuServers from '../modules/osu/servers/OsuServers';

export default class FurudeRika extends BaseBot {
  public readonly db = new FurudeDB();
  public readonly localizer = new FurudeLocales();
  public readonly reminderManager = new ReminderManager(this);
  public readonly userScanner = new UserScanner(this);
  public readonly osuServers = new OsuServers({
    bancho_api_key: process.env.BANCHO_API_KEY,
  });

  private readonly forceDeploy = true;
  private readonly isDebug = true;

  public constructor() {
    super(
      {
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      },
      {
        ENV_TOKEN_VAR: 'BOT_TOKEN',
        ENV_DEVELOPMENT_SERVER: 'DEV_GUILD_ID',
        OWNER_IDS: ['902963589898444800'],
      },
      new DirectoryMapperFactory(path.join('dist', 'commands'), [
        'subcommands',
        'groups',
        'wrapper',
      ])
    );
  }

  override async start(): Promise<void> {
    await super.start();
    await this.localizer.build();
    await this.db.connect();

    await this.reminderManager.setupReminders();
    this.userScanner.startScan();

    this.on('messageCreate', async (message) => {
      if (!message.guild || !message.member || message.member.user.bot) return;
      const user = await this.db.USER.get(message.member.user);
      user.setUsername(message.member.user.username);
      const operation = user.incrementExperience(message.member.user, {
        rawGuild: message.guild,
        dbGuild: await this.db.GUILD.get(message.guild),
      });
      if (operation.successfully) {
        consola.success(operation.response);
      }
      FurudeOperations.saveWhenSuccess(user, operation);
    });
  }

  public override async onSubCommandNotFound(
    interaction: CommandInteraction
  ): Promise<void> {
    const dependency = new DefaultContext({
      interaction: interaction,
      client: this,
    });
    const localizer = new FurudeLocales({
      language: dependency.dbUser.preferred_locale ?? undefined,
    });
    await interaction.reply(
      localizer.get(FurudeTranslationKeys.SUBCOMMAND_ERROR_NOT_FOUND)
    );
  }

  public override onCommandRun(response: ICommandRunResponse): void {
    const { interaction, command } = response;
    consola.success(
      `Command "${
        command.information.name
      }" was ran, requested by: ${interaction.user.toString()} on channel: ${
        interaction.channel?.id
      } on server: ${interaction.guild?.name}`
    );
  }

  public override async onCommandsLoaded(): Promise<void> {
    consola.log(this.commands.size + ' commands were loaded');
    if (!this.forceDeploy) return;
    await DeployHandler.deployAll(this, this.isDebug, {
      onError: () => {
        consola.error(`Error deploying all commands`);
      },
      onSuccess: () => {
        consola.success(`Deployed all commands`);
      },
    });
  }
}
