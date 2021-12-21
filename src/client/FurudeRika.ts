import { CommandInteraction, Intents } from 'discord.js';
import BaseBot from '../framework/client/BaseBot';
import consola from 'consola';
import ICommandRunResponse from '../framework/client/ICommandRunResponse';
import DeployHandler from '../framework/rest/DeployHandler';
import DirectoryMapperFactory from '../framework/io/DirectoryMapperFactory';
import path from 'path';
import FurudeLocales from '../localization/FurudeLocales';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';

export default class FurudeRika extends BaseBot {
  public readonly localizer = new FurudeLocales();
  private readonly forceDeploy: boolean = true;

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
      async () => {
        console.log(this.commands.size + ' commands were loaded');
        if (!this.forceDeploy) return;
        const isDebug = true;
        await DeployHandler.deployAll(this, isDebug, {
          onError: () => {
            consola.error(`Error deploying all commands`);
          },
          onSuccess: () => {
            consola.success(`Deployed all commands`);
          },
        });
      },
      new DirectoryMapperFactory(path.join('dist', 'commands'), ['subcommands'])
    );
  }

  override async start(): Promise<void> {
    super.start();
    await this.localizer.build();
  }

  public override async onSubCommandNotFound(
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.reply(
      this.localizer.get(FurudeTranslationKeys.SUBCOMMAND_ERROR_NOT_FOUND)
    );
  }

  public override onCommandRun(response: ICommandRunResponse): void {
    const { interaction, command } = response;
    consola.success(
      `Command "${
        command.name
      }" was ran, requested by: ${interaction.user.toString()} on channel: ${
        interaction.channel?.id
      } on server: ${interaction.guild?.name}`
    );
  }
}
