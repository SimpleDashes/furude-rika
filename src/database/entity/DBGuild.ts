import type { GuildChannel, Snowflake } from 'discord.js';
import BindableInteger from '../../modules/bindables/BindableInteger';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import type FurudeLocalizer from '../../localization/FurudeLocalizer';
import FurudeOperations from '../FurudeOperations';
import type IDatabaseOperation from '../interfaces/IDatabaseOperation';
import type IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import EntityExtension from '../objects/abstracts/EntityExtension';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';
import DBUser from './DBUser';
import EntityWithLocaleHelper from './helpers/EntityWithLocaleHelper';
import type { FurudeLanguages } from '../../localization/FurudeLocalizer';
import type DefaultContext from '../../contexts/DefaultContext';
import { Entity, Column } from 'typeorm';

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
  public preferred_locale?: FurudeLanguages | undefined;

  @Column('number')
  public min_rewarded_xp_value?: number;

  @Column('number')
  public max_rewarded_xp_value?: number;

  @Column('number')
  public time_for_xp?: number;

  public setPreferredLocale(
    localizer: FurudeLocalizer,
    locale: FurudeLanguages | undefined
  ): IDatabaseOperation {
    return EntityWithLocaleHelper.setPreferredLocale(
      this,
      localizer,
      locale,
      (k) => k.customize.locale.guild.responses.default,
      (k) => k.customize.locale.guild.responses.any
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
    context: DefaultContext<unknown>,
    channel: GuildChannel
  ): IDatabaseOperation {
    const { client } = context;
    const { localizer } = client;

    if (this.blocked_xp_channels.includes(channel.id)) {
      return FurudeOperations.error(
        localizer.getTranslationFromContext(
          context,
          (k) => k.database.guild.xp.channels.already.blacklisted,
          {
            CHANNEL: channel.toString(),
          }
        )
      );
    }

    this.blocked_xp_channels.push(channel.id);

    return FurudeOperations.success(
      localizer.getTranslationFromContext(
        context,
        (k) => k.database.guild.xp.channels.blacklisted,
        {
          CHANNEL: channel.toString(),
        }
      )
    );
  }

  /**
   * Whitelist a channel which was previously blacklisted
   * from rewarding experience to user who send messages on it.
   * @param channel The channel to be whitelisted.
   */
  public whitelistChannelToRewardXP(
    context: DefaultContext<unknown>,
    channel: GuildChannel
  ): IDatabaseOperation {
    const { client } = context;
    const { localizer } = client;

    if (!this.blocked_xp_channels.includes(channel.id)) {
      return FurudeOperations.error(
        localizer.getTranslationFromContext(
          context,
          (k) => k.database.guild.xp.channels.already.whitelisted,
          {
            CHANNEL: channel.toString(),
          }
        )
      );
    }

    this.blocked_xp_channels = this.blocked_xp_channels.filter(
      (o) => o != channel.id
    );

    return FurudeOperations.success(
      localizer.getTranslationFromContext(
        context,
        (k) => k.database.guild.xp.channels.whitelisted,
        { CHANNEL: channel.toString() }
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
    context: DefaultContext<unknown>,
    time: number
  ): IDatabaseOperation {
    const { client } = context;
    const { localizer } = client;

    this.time_for_xp = this.#extension.time_for_xp.Current = time;
    return FurudeOperations.success(
      localizer.getTranslationFromContext(
        context,
        (k) => k.database.guild.xp.time.changed,
        {
          TIME: MessageCreator.block(time.toFixed()),
        }
      )
    );
  }
}
