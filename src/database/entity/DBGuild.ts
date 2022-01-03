import { GuildChannel, Snowflake } from 'discord.js';
import { Column, Entity } from 'typeorm';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import FurudeOperations from '../FurudeOperations';
import IDatabaseOperation from '../interfaces/IDatabaseOperation';
import IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';

@Entity()
export default class DBGuild
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  @Column()
  preferred_locale?: SupportedFurudeLocales | undefined | null;

  /**
   * Guild channels which the guild users
   * are blocked from being rewarded experience on
   */
  @Column('array')
  blocked_xp_channels: Snowflake[] = [];

  /**
   * Blacklists a channel from rewarding experience
   * to users who send messages on it.
   * @param channel The channel to be blacklisted.
   */
  public blacklistChannelFromRewardingXP(
    localizer: FurudeLocales,
    channel: GuildChannel
  ): IDatabaseOperation {
    if (this.blocked_xp_channels.find((o) => o == channel.id)) {
      return FurudeOperations.error(
        localizer.get(
          FurudeTranslationKeys.DATABASE_GUILD_ALREADY_BLACKLISTED_XP_CHANNEL,
          [channel.toString()]
        )
      );
    }
    this.blocked_xp_channels.push(channel.id);
    return FurudeOperations.success(
      localizer.get(
        FurudeTranslationKeys.DATABASE_GUILD_BLACKLISTED_XP_CHANNEL,
        [channel.toString()]
      )
    );
  }

  /**
   * Whitelist a channel which was previously blacklisted
   * from rewarding experience to user who send messages on it.
   * @param channel The channel to be whitelisted.
   */
  public whitelistChannelToRewardXP(
    localizer: FurudeLocales,
    channel: GuildChannel
  ): IDatabaseOperation {
    if (!this.blocked_xp_channels.find((o) => o == channel.id)) {
      return FurudeOperations.error(
        localizer.get(
          FurudeTranslationKeys.DATABASE_GUILD_ALREADY_WHITELISTED_XP_CHANNEL,
          [channel.toString()]
        )
      );
    }
    this.blocked_xp_channels.filter((o) => o != channel.id);
    return FurudeOperations.success(
      localizer.get(
        FurudeTranslationKeys.DATABASE_GUILD_WHITELISTED_XP_CHANNEL,
        [channel.toString()]
      )
    );
  }
}
