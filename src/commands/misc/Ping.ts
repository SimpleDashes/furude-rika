import type { CommandInteraction } from 'discord.js';
import type DefaultContext from '../../contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import BaseEmbed from '../../discord/embeds/BaseEmbed';
import UserType from '../../discord/enums/UserType';
import PingContainer from '../../discord/ping/PingContainer';
import PingData from '../../discord/ping/PingData';
import MessageCreator from '../../utils/MessageCreator';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import { InteractionUtils } from 'discowork';
interface IPingCallbackArguments {
  interaction: CommandInteraction;
}

class PingDataType extends PingData<IPingCallbackArguments> {
  public constructor(pingWhat: string) {
    super(pingWhat);
  }
}

class PingContainerType extends PingContainer<
  IPingCallbackArguments,
  PingDataType
> {
  public readonly discord: PingDataType;

  public constructor() {
    super();
    this.data.push(
      (this.discord = new PingDataType('Discord websocket').setPingCallback(
        async (args) => args.interaction.client.ws.ping
      ))
    );
  }
}

type Args = unknown;

@CommandInformation({
  name: 'ping',
  description: 'Pings multiple servers.',
})
export default class Ping extends FurudeCommand<Args, DefaultContext<Args>> {
  public createArguments(): Args {
    return {};
  }

  readonly #pingContainer: PingContainerType = new PingContainerType();

  public async trigger(context: DefaultContext<Args>): Promise<void> {
    const { interaction, client } = context;
    const { localizer } = client;

    const embed = new BaseEmbed({}, interaction, {
      author: interaction.user,
      defaultsTo: UserType.MEMBER,
    });

    const pingArgs: IPingCallbackArguments = {
      interaction,
    };

    for (const pingData of this.#pingContainer.data) {
      const ping = await pingData.ping?.call(pingData, pingArgs);

      const text = ping
        ? localizer.getTranslationFromContext(context, (k) => k.ping.response, {
            PING: ping.toString(),
          })
        : localizer.getTranslationFromContext(
            context,
            (k) => k.ping.unreachable,
            {}
          );

      const value = MessageCreator.bold(MessageCreator.blockQuote(text));
      embed.addField(pingData.pingWhat, value);
    }

    await InteractionUtils.reply(interaction, {
      embeds: [embed],
    });
  }
}
