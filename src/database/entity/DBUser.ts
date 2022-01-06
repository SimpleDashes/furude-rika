import { intervalToDuration } from 'date-fns';
import { Guild, User } from 'discord.js';
import { Column, Entity } from 'typeorm';
import Globals from '../../containers/Globals';
import Strings from '../../containers/Strings';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import FurudeOperations from '../FurudeOperations';
import IDatabaseOperation from '../interfaces/IDatabaseOperation';
import IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import GuildHyperDate from '../objects/hypervalues/concrets/guilds/GuildHyperDate';
import GuildHyperNumber from '../objects/hypervalues/concrets/guilds/GuildHyperNumber';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';
import DBGuild from './DBGuild';
import EntityWithLocaleHelper from './helpers/EntityWithLocaleHelper';

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

  @Column()
  preferred_locale?: SupportedFurudeLocales | undefined | null;

  @Column('string')
  username: string = Strings.UNKNOWN;

  @Column((_type) => GuildHyperNumber)
  experience = new GuildHyperNumber();

  @Column((_type) => GuildHyperDate)
  lastTimeGotExperience = new GuildHyperDate(null);

  setPreferredLocale(
    localizer: FurudeLocales,
    locale: SupportedFurudeLocales | null | undefined
  ): IDatabaseOperation {
    return EntityWithLocaleHelper.setPreferredLocale(
      this,
      localizer,
      locale,
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_USER
    );
  }

  public setUsername(username: string) {
    this.username = username.trim();
  }

  /**
   * Increments the user experience, both globally
   * and according to rules for the guild he is in
   */
  public incrementExperience(
    user: User,
    guildInfo?: {
      rawGuild: Guild;
      dbGuild: DBGuild;
    }
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
      this.experience.global! += incrementedGlobalExperience;
      this.lastTimeGotExperience.global = dateNow;
      success = true;
    }
    if (guildInfo) {
      const { rawGuild, dbGuild } = guildInfo;
      if (!dbGuild.blocked_xp_channels.find((o) => o === rawGuild.id)) {
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
          this.experience.setLocal(
            rawGuild,
            this.experience.currentLocal(rawGuild)! + incrementedLocalExperience
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
