import assert from 'assert';
import { ChannelType } from 'discord-api-types';
import { GuildChannel } from 'discord.js';
import DefaultContext from '../../../../../client/contexts/DefaultContext';
import CommandOptions from '../../../../../containers/CommandOptions';
import Strings from '../../../../../containers/Strings';
import FurudeOperations from '../../../../../database/FurudeOperations';
import IDatabaseOperation from '../../../../../database/interfaces/IDatabaseOperation';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/commands/decorators/PreconditionDecorators';
import BaseEmbed from '../../../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../../../modules/framework/helpers/MessageCreator';
import BooleanOption from '../../../../../modules/framework/options/classes/BooleanOption';
import ChannelOption from '../../../../../modules/framework/options/classes/ChannelOption';

@SetPreconditions(
  Preconditions.GuildOnly,
  Preconditions.WithPermission('ADMINISTRATOR')
)
export default class CustomizeBlockedFromXPChannels extends FurudeSubCommand {
  private channelToManipulate = this.registerOption(
    new ChannelOption()
      .setRequired(true)
      .setName(CommandOptions.channel)
      .setDescription('The channel which you want to whitelist or blacklist.')
      .addChannelType(ChannelType.GuildText)
  );

  private isWhitelist = this.registerOption(
    new BooleanOption()
      .setName(CommandOptions.whitelist)
      .setDescription(
        'Wether to whitelist rather than blacklist the channel. Defaults to false.'
      )
  );

  public constructor() {
    super({
      name: 'experience_channel',
      description:
        'Whitelists or blacklists an channel from being able to reward experience.',
    });
  }

  public async trigger(context: DefaultContext): Promise<void> {
    const { interaction, dbGuild, client, localizer } = context;

    assert(dbGuild);

    const whitelist = this.isWhitelist.apply(interaction) ?? false;
    const selectedChannel = this.channelToManipulate.apply(
      interaction
    ) as GuildChannel;

    let operation: IDatabaseOperation;
    if (whitelist) {
      operation = dbGuild.whitelistChannelToRewardXP(
        localizer,
        selectedChannel
      );
    } else {
      operation = dbGuild.blacklistChannelFromRewardingXP(
        localizer,
        selectedChannel
      );
    }

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
