import { ChannelType } from 'discord-api-types';
import { CommandInteraction, CacheType, GuildChannel } from 'discord.js';
import DefaultContext from '../../../../../client/contexts/DefaultContext';
import FurudeRika from '../../../../../client/FurudeRika';
import CommandOptions from '../../../../../containers/CommandOptions';
import Strings from '../../../../../containers/Strings';
import FurudeOperations from '../../../../../database/FurudeOperations';
import IDatabaseOperation from '../../../../../database/interfaces/IDatabaseOperation';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import {
  RequirePermissions,
  RequiresGuild,
} from '../../../../../framework/commands/decorators/PreconditionDecorators';
import BaseEmbed from '../../../../../framework/embeds/BaseEmbed';
import MessageCreator from '../../../../../framework/helpers/MessageCreator';
import BooleanOption from '../../../../../framework/options/classes/BooleanOption';
import ChannelOption from '../../../../../framework/options/classes/ChannelOption';

@RequiresGuild
@RequirePermissions(['ADMINISTRATOR'])
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

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const whitelist = this.isWhitelist.apply(interaction) ?? false;
      const selectedChannel = this.channelToManipulate.apply(
        interaction
      ) as GuildChannel;

      let operation: IDatabaseOperation;
      if (whitelist) {
        operation = runner.args!.dbGuild!.whitelistChannelToRewardXP(
          runner.args!.localizer,
          selectedChannel
        );
      } else {
        operation = runner.args!.dbGuild!.blacklistChannelFromRewardingXP(
          runner.args!.localizer,
          selectedChannel
        );
      }

      let blockedChannelsString = Strings.EMPTY;
      for (const channel of runner.args!.dbGuild!.blocked_xp_channels) {
        blockedChannelsString += `<#${channel}>\n`;
      }

      const embed = new BaseEmbed(
        {
          title: 'XP Blacklist',
          description: MessageCreator.bold(blockedChannelsString),
        },
        interaction
      );

      await FurudeOperations.saveWhenSuccess(runner.args!.dbGuild!, operation);
      await FurudeOperations.answerInteraction(interaction, operation, {
        embeds: [embed],
      });
    };
  }
}
