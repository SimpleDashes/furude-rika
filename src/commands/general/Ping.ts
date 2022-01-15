import type { CommandInteraction } from 'discord.js';
import type DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import BaseEmbed from '../../modules/framework/embeds/BaseEmbed';
import UserType from '../../modules/framework/enums/UserType';
import PingContainer from '../../modules/framework/ping/PingContainer';
import PingData from '../../modules/framework/ping/PingData';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';
import type { TypedArgs } from '../../modules/framework/commands/decorators/ContextDecorators';

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
    this.discord = this.pushGet(
      new PingDataType('Discord websocket').setPingCallback(
        async (args) => args.interaction.client.ws.ping
      )
    );
  }
}

type Args = unknown;
export default class Ping extends FurudeCommand<
  DefaultContext<TypedArgs<Args>>,
  Args
> {
  public createArgs(): Args {
    return {};
  }

  readonly #pingContainer: PingContainerType = new PingContainerType();

  public constructor() {
    super({
      name: 'ping',
      description: 'Pings multiple servers',
    });
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
    const { interaction, localizer } = context;

    const embed = new BaseEmbed({}, interaction, {
      author: interaction.user,
      defaultsTo: UserType.MEMBER,
    });

    const pingArgs: IPingCallbackArguments = {
      interaction,
    };

    for (const pingData of this.#pingContainer.InternalArray) {
      const ping = await pingData.ping?.call(pingData, pingArgs);

      const text = ping
        ? localizer.get(FurudeTranslationKeys.PING_TO_PING, [ping?.toString()])
        : localizer.get(FurudeTranslationKeys.PING_NOT_REACHABLE);

      const value = MessageCreator.bold(MessageCreator.blockQuote(text));
      embed.addField(pingData.pingWhat, value);
    }

    await InteractionUtils.reply(interaction, {
      embeds: [embed],
    });
  }
}
