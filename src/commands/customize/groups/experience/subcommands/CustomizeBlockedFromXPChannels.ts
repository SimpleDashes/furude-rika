import assert from 'assert';
import { ChannelType } from 'discord-api-types';
import { GuildChannel } from 'discord.js';
import {
  ChannelOption,
  BooleanOption,
  CommandPreconditions,
  Preconditions,
  assertDefined,
} from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import CommandOptions from '../../../../../containers/CommandOptions';
import Strings from '../../../../../containers/Strings';
import type DefaultContext from '../../../../../contexts/DefaultContext';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import BaseEmbed from '../../../../../discord/embeds/BaseEmbed';
import MessageCreator from '../../../../../utils/MessageCreator';

type Args = {
  channel: ChannelOption;
  whitelist: BooleanOption;
};

@CommandPreconditions(
  Preconditions.GuildOnly,
  Preconditions.WithPermission('ADMINISTRATOR')
)
@CommandInformation({
  name: 'experience_channel',
  description:
    'Whitelists or blacklists an channel from being able to reward experience.',
})
export default class CustomizeBlockedFromXPChannels extends FurudeSubCommand<
  Args,
  DefaultContext<Args>
> {
  public createArguments(): Args {
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

  public async trigger(context: DefaultContext<Args>): Promise<void> {
    const { interaction, dbGuild, client, args } = context;
    const { channel, whitelist } = args;

    assertDefined(dbGuild);
    assert(channel instanceof GuildChannel);

    const operation = (
      whitelist
        ? dbGuild.whitelistChannelToRewardXP
        : dbGuild.blacklistChannelFromRewardingXP
    )(context, channel);

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
