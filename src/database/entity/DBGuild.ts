import type { GuildChannel, Snowflake } from 'discord.js';
import { Column, Entity } from 'typeorm';
import BindableInteger from '../../modules/bindables/BindableInteger';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import type FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import type SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import FurudeOperations from '../FurudeOperations';
import type IDatabaseOperation from '../interfaces/IDatabaseOperation';
import type IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import EntityExtension from '../objects/abstracts/EntityExtension';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';
import DBUser from './DBUser';
import EntityWithLocaleHelper from './helpers/EntityWithLocaleHelper';

class DBGuildExtension extends EntityExtension<DBGuild> {
  #getBindableRewardedXP(): BindableInteger {
    return new BindableInteger(undefined, undefined, {
      minValue: DBGuild.MIN_XP_CHANGE_VALUE,
      maxValue: DBGuild.MAX_XP_CHANGE_VALUE,
    });
  }

  public min_rewarded_xp: BindableInteger = this.#getBindableRewardedXP();

  public max_rewarded_xp: BindableInteger = this.#getBindableRewardedXP();

  public time_for_xp: BindableInteger = new BindableInteger(
    undefined,
    undefined,
    {
      minValue: DBUser.MIN_MIN_SECONDS_FOR_EXPERIENCE,
      maxValue: DBUser.MAX_MIN_SECONDS_FOR_EXPERIENCE,
    }
  );
}

@Entity()
export default class DBGuild
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  public static MIN_XP_CHANGE_VALUE = 0;
  public static MAX_XP_CHANGE_VALUE = 100;

  @Column()
  public preferred_locale?: SupportedFurudeLocales | undefined;

  @Column('number')
  public min_rewarded_xp_value?: number;

  @Column('number')
  public max_rewarded_xp_value?: number;

  @Column('number')
  public time_for_xp?: number;

  public setPreferredLocale(
    localizer: FurudeLocales,
    locale: SupportedFurudeLocales | null | undefined
  ): IDatabaseOperation {
    return EntityWithLocaleHelper.setPreferredLocale(
      this,
      localizer,
      locale,
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_GUILD,
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_GUILD_ANY
    );
  }

  /**
   * Guild channels which the guild users
   * are blocked from being rewarded experience on
   */
  @Column('array')
  public blocked_xp_channels: Snowflake[] = [];

  #extension = new DBGuildExtension(this);

  public constructor() {
    super();
  }

  /**
   * Blacklists a channel from rewarding experience
   * to users who send messages on it.
   * @param channel The channel to be blacklisted.
   */
  public blacklistChannelFromRewardingXP(
    localizer: FurudeLocales,
    channel: GuildChannel
  ): IDatabaseOperation {
    if (this.blocked_xp_channels.includes(channel.id)) {
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
    if (!this.blocked_xp_channels.includes(channel.id)) {
      return FurudeOperations.error(
        localizer.get(
          FurudeTranslationKeys.DATABASE_GUILD_ALREADY_WHITELISTED_XP_CHANNEL,
          [channel.toString()]
        )
      );
    }
    this.blocked_xp_channels = this.blocked_xp_channels.filter(
      (o) => o != channel.id
    );
    return FurudeOperations.success(
      localizer.get(
        FurudeTranslationKeys.DATABASE_GUILD_WHITELISTED_XP_CHANNEL,
        [channel.toString()]
      )
    );
  }

  public setMinXPValue(value: number): IDatabaseOperation {
    this.min_rewarded_xp_value = this.#extension.min_rewarded_xp.Current =
      value;
    return FurudeOperations.success(
      'Changed minimal rewarded xp successfully!'
    );
  }

  public setMaxXPValue(value: number): IDatabaseOperation {
    this.max_rewarded_xp_value = this.#extension.max_rewarded_xp.Current =
      value;
    return FurudeOperations.success(
      'Changed maximal rewarded xp successfully!'
    );
  }

  public setTimeForXP(
    localizer: FurudeLocales,
    time: number
  ): IDatabaseOperation {
    this.time_for_xp = this.#extension.time_for_xp.Current = time;
    return FurudeOperations.success(
      localizer.get(FurudeTranslationKeys.DATABASE_GUILD_CHANGED_TIME_FOR_XP, [
        MessageCreator.block(time.toFixed()),
      ])
    );
  }
}
