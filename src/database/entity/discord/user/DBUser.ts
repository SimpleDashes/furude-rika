import 'reflect-metadata';
import { intervalToDuration } from 'date-fns';
import type { Guild, GuildChannel, Snowflake, User } from 'discord.js';
import { assertDefinedGet } from 'discowork';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import Globals from '../../../../containers/Globals';
import Strings from '../../../../containers/Strings';
import type FurudeLocalizer from '../../../../localization/FurudeLocalizer';
import type { FurudeLanguages } from '../../../../localization/FurudeLocalizer';
import FurudeOperations from '../../../FurudeOperations';
import type IDatabaseOperation from '../../../interfaces/IDatabaseOperation';
import type IHasPreferredLocale from '../../../interfaces/IHasPreferredLocale';
import GuildHyperDate from '../../../objects/hypervalues/concrets/guilds/GuildHyperDate';
import GuildHyperNumber from '../../../objects/hypervalues/concrets/guilds/GuildHyperNumber';
import SnowFlakeIDEntity from '../../abstracts/SnowFlakeIDEntity';
import DBCitizen from './DBCitizen';
import type DBGuild from '../DBGuild';
import DBReminder from './DBReminder';
import EntityWithLocaleHelper from '../../helpers/EntityWithLocaleHelper';
import DBUserOsu from './DBUserOsu';

export type IncrementLocalUserExperienceInfo = {
  rawGuild: Guild;
  dbGuild: DBGuild;
  channel: GuildChannel;
};

/**
 * This class contains general information
 * Retained on the database related to a said user
 */
@Entity()
export default class DBUser
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  public static MIN_GLOBAL_EXPERIENCE_ADD = 5;
  public static MAX_GLOBAL_EXPERIENCE_ADD = 10;
  public static MIN_MIN_SECONDS_FOR_EXPERIENCE = 30;
  public static MAX_MIN_SECONDS_FOR_EXPERIENCE = 60 * 60;
  public static MIN_SECONDS_FOR_EXPERIENCE_GLOBAL = 30;

  @JoinColumn()
  @OneToOne(() => DBCitizen, (citizen) => citizen.user)
  public citizen!: DBCitizen;

  @JoinColumn()
  @OneToOne(() => DBUserOsu, (osuPlayer) => osuPlayer.user)
  public osuPlayer!: DBUserOsu;

  @OneToMany(() => DBReminder, (reminder) => reminder.owner)
  public reminders!: DBReminder[];

  @Column('string')
  public username: string = Strings.UNKNOWN;

  @Column('string', { array: true, default: JSON.stringify({}) })
  public guilds: Snowflake[] = [];

  @Column(() => GuildHyperNumber)
  public experience = new GuildHyperNumber();

  @Column(() => GuildHyperDate)
  public lastTimeGotExperience = new GuildHyperDate(null);

  @Column('string', { nullable: true })
  public preferred_locale?: FurudeLanguages | undefined;

  public setPreferredLocale(
    localizer: FurudeLocalizer,
    locale: FurudeLanguages | undefined
  ): IDatabaseOperation {
    return EntityWithLocaleHelper.setPreferredLocale(
      this,
      localizer,
      locale,
      (k) => k.customize.locale.user.response
    );
  }

  public setUsername(username: string): void {
    this.username = username.trim();
  }

  /**
   * Increments the user experience, both globally
   * and according to rules for the guild he is in
   */
  public incrementExperience(
    user: User,
    runInfo?: IncrementLocalUserExperienceInfo
  ): IDatabaseOperation {
    const dateNow = new Date();
    const differenceGlobal = intervalToDuration({
      start: this.lastTimeGotExperience.global ?? dateNow,
      end: dateNow,
    });
    let success = false;
    if (
      !this.lastTimeGotExperience.global ||
      (differenceGlobal.seconds &&
        differenceGlobal.seconds >= DBUser.MIN_SECONDS_FOR_EXPERIENCE_GLOBAL)
    ) {
      const incrementedGlobalExperience = Globals.CHANCE.integer({
        min: DBUser.MIN_GLOBAL_EXPERIENCE_ADD,
        max: DBUser.MAX_GLOBAL_EXPERIENCE_ADD,
      });
      this.experience.global += incrementedGlobalExperience;
      this.lastTimeGotExperience.global = dateNow;
      success = true;
    }
    if (runInfo) {
      const { rawGuild, dbGuild, channel } = runInfo;
      if (!dbGuild.blocked_xp_channels.includes(channel.id)) {
        const nullableLocalLastTimeGotExperience =
          this.lastTimeGotExperience.currentLocal(rawGuild);
        const currentLocalLastTimeGotExperience =
          nullableLocalLastTimeGotExperience ?? dateNow;
        const localDifference = intervalToDuration({
          start: currentLocalLastTimeGotExperience,
          end: dateNow,
        });
        const guildMinSecondsForExperiences =
          dbGuild.time_for_xp ?? DBUser.MIN_SECONDS_FOR_EXPERIENCE_GLOBAL;
        if (
          !nullableLocalLastTimeGotExperience ||
          (localDifference.seconds &&
            localDifference.seconds >= guildMinSecondsForExperiences)
        ) {
          const incrementedLocalExperience = Globals.CHANCE.integer({
            min:
              dbGuild.min_rewarded_xp_value ?? DBUser.MIN_GLOBAL_EXPERIENCE_ADD,
            max:
              dbGuild.max_rewarded_xp_value ?? DBUser.MAX_GLOBAL_EXPERIENCE_ADD,
          });
          const localValue = assertDefinedGet(
            this.experience.currentLocal(rawGuild)
          );
          this.experience.setLocal(
            rawGuild,
            localValue + incrementedLocalExperience
          );
          this.lastTimeGotExperience.setLocal(rawGuild, dateNow);
          success = true;
        }
      }
    }
    return success
      ? FurudeOperations.success(
          `Incremented ${user.username}'s experience successfully!`
        )
      : FurudeOperations.error(
          `The user: ${user.username} needs to wait a bit more before being rewarded with experience.`
        );
  }
}
