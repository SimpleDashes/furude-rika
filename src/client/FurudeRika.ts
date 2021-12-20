import { Intents } from 'discord.js';
import BaseBot from '../framework/client/BaseBot';
import consola from 'consola';
import ICommandRunResponse from '../framework/client/ICommandRunResponse';
import DeployHandler from '../framework/rest/DeployHandler';
import DirectoryMapperFactory from '../framework/io/DirectoryMapperFactory';
import path from 'path';
import FurudeLocales from '../localization/FurudeLocales';

export default class FurudeRika extends BaseBot {
  public readonly localizer = new FurudeLocales();
  private readonly forceDeploy: boolean = false;

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
        for await (const command of this.commands.values()) {
          await DeployHandler.deployCommand({
            client: this,
            commandName: command.name,
            isDebug: true,
            guild: this.devInfo.developmentGuild,
            onCommandNotFound: () => {
              consola.error(`Command not found: ${command.name}`);
            },
            onInvalidCommand: () => {
              consola.error(`Invalid command: ${command.name}`);
            },
            onError: () => {
              consola.error(`Error deploying: ${command.name}`);
            },
            onSuccess: () => {
              consola.success(`Deployed command: ${command.name}`);
            },
          });
        }
      },
      new DirectoryMapperFactory(path.join('dist', 'commands'))
    );
  }

  override async start(): Promise<void> {
    super.start();
    await this.localizer.build();
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
