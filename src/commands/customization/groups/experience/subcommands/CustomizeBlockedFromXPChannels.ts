import assert from 'assert';
import { ChannelType } from 'discord-api-types';
import { GuildChannel } from 'discord.js';
import type DefaultContext from '../../../../../client/contexts/DefaultContext';
import CommandOptions from '../../../../../containers/CommandOptions';
import Strings from '../../../../../containers/Strings';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import type { TypedArgs } from '../../../../../modules/framework/commands/contexts/types';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/preconditions/PreconditionDecorators';
import BaseEmbed from '../../../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../../../modules/framework/helpers/MessageCreator';
import BooleanOption from '../../../../../modules/framework/options/classes/BooleanOption';
import ChannelOption from '../../../../../modules/framework/options/classes/ChannelOption';
import { assertDefined } from '../../../../../modules/framework/types/TypeAssertions';

type Args = {
  channel: ChannelOption;
  whitelist: BooleanOption;
};
@SetPreconditions(
  Preconditions.GuildOnly,
  Preconditions.WithPermission('ADMINISTRATOR')
)
export default class CustomizeBlockedFromXPChannels extends FurudeSubCommand<
  DefaultContext<TypedArgs<Args>>,
  Args
> {
  public createArgs(): Args {
    return {
      channel: new ChannelOption()
        .setRequired(true)
        .setName(CommandOptions.channel)
        .setDescription('The channel which you want to whitelist or blacklist.')
        .addChannelType(ChannelType.GuildText),
      whitelist: new BooleanOption()
        .setName(CommandOptions.whitelist)
        .setDescription(
          'Wether to whitelist rather than blacklist the channel. Defaults to false.'
        ),
    };
  }

  public constructor() {
    super({
      name: 'experience_channel',
      description:
        'Whitelists or blacklists an channel from being able to reward experience.',
    });
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
    const { interaction, dbGuild, client, localizer, args } = context;
    const { channel, whitelist } = args;

    assertDefined(dbGuild);
    assert(channel instanceof GuildChannel);

    const operation = (
      whitelist
        ? dbGuild.whitelistChannelToRewardXP
        : dbGuild.blacklistChannelFromRewardingXP
    )(localizer, channel);

    let blockedChannelsString = Strings.EMPTY;
    for (const channel of dbGuild.blocked_xp_channels) {
      const cacheChannel = client.channels.cache.get(channel);
      if (cacheChannel) {
        blockedChannelsString += cacheChannel.toString();
        blockedChannelsString += '\n';
      }
    }

    const embed = new BaseEmbed(
      {
        title: 'XP Blacklist',
        description: MessageCreator.bold(blockedChannelsString),
      },
      interaction
    );

    await FurudeOperations.saveWhenSuccess(dbGuild, operation);
    await FurudeOperations.answerInteraction(interaction, operation, {
      embeds: [embed],
    });
  }
}
