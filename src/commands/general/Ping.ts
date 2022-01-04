import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import BaseEmbed from '../../framework/embeds/BaseEmbed';
import UserType from '../../framework/enums/UserType';
import PingContainer from '../../framework/ping/PingContainer';
import PingData from '../../framework/ping/PingData';
import MessageCreator from '../../framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';

interface IPingCallbackArguments {
  interaction: CommandInteraction;
}

class PingDataType extends PingData<IPingCallbackArguments> {
  public constructor(pingWhat: string) {
    super(pingWhat);
  }
}

class PingContainerType extends PingContainer<PingDataType> {
  public readonly discord: PingDataType;

  public constructor() {
    super();
    this.discord = this.pushGet(
      new PingDataType('Discord websocket').setPingCallback(
        (args) => args.interaction.client.ws.ping
      )
    );
  }
}

export default class Ping extends FurudeCommand {
  private readonly pingContainer: PingContainerType = new PingContainerType();

  public constructor() {
    super({
      name: 'ping',
      description: 'Pings multiple servers',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const embed = new BaseEmbed({}, interaction, {
        author: interaction.user,
        defaultsTo: UserType.MEMBER,
      });

      const pingArgs: IPingCallbackArguments = {
        interaction,
      };

      this.pingContainer.InternalArray.forEach((pingData) => {
        const ping = pingData.ping?.call(pingData, pingArgs);

        const text = ping
          ? runner.args!.localizer.get(FurudeTranslationKeys.PING_TO_PING, [
              ping?.toString(),
            ])
          : runner.args!.localizer.get(
              FurudeTranslationKeys.PING_NOT_REACHABLE
            );
        const value = MessageCreator.bold(MessageCreator.blockQuote(text));
        embed.addField(pingData.pingWhat, value);
      });

      await interaction.editReply({
        embeds: [embed],
      });
    };
  }
}
