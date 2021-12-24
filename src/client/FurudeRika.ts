import { CommandInteraction, Intents } from 'discord.js';
import BaseBot from '../framework/client/BaseBot';
import consola from 'consola';
import ICommandRunResponse from '../framework/client/ICommandRunResponse';
import DeployHandler from '../framework/rest/DeployHandler';
import DirectoryMapperFactory from '../framework/io/DirectoryMapperFactory';
import path from 'path';
import FurudeLocales from '../localization/FurudeLocales';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';
import FurudeDB from '../database/FurudeDB';
import DefaultContext from './contexts/DefaultContext';

export default class FurudeRika extends BaseBot {
  public readonly db = new FurudeDB();
  public readonly localizer = new FurudeLocales();

  private readonly forceDeploy = true;
  private readonly isDebug = false;

  public constructor() {
    super(
      {
        intents: [Intents.FLAGS.GUILDS],
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
    super.start();
    await this.localizer.build();
    await this.db.connect();
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
