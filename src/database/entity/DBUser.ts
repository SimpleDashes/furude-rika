import { intervalToDuration } from 'date-fns';
import { Guild, User } from 'discord.js';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import Globals from '../../containers/Globals';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import FurudeOperations from '../FurudeOperations';
import IDatabaseOperation from '../interfaces/IDatabaseOperation';
import IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import GuildHyperDate from '../objects/hypervalues/concrets/guilds/GuildHyperDate';
import GuildHyperNumber from '../objects/hypervalues/concrets/guilds/GuildHyperNumber';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';
import DBCitizen from './DBCitizen';
import DBGuild from './DBGuild';

/**
 * This class contains general information
 * Retained on the database related to a said user
 */
@Entity()
export default class DBUser
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  public static MIN_GLOBAL_EXPERIENCE_ADD = 0;
  public static MAX_GLOBAL_EXPERIENCE_ADD = 10;
  public static MIN_MINUTES_FOR_EXPERIENCE_GLOBAL = 2;

  @Column()
  preferred_locale?: SupportedFurudeLocales | undefined | null;

  @Column((_type) => GuildHyperNumber)
  experience = new GuildHyperNumber();

  @Column((_type) => GuildHyperDate)
  lastTimeGotExperience = new GuildHyperDate(null);

  @OneToOne((_type) => DBCitizen, { cascade: true })
  @JoinColumn()
  citizen!: DBCitizen;

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
      (differenceGlobal.minutes &&
        differenceGlobal.minutes >= DBUser.MIN_MINUTES_FOR_EXPERIENCE_GLOBAL)
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
      if (!dbGuild.blocked_xp_channels.find((o) => o == rawGuild.id)) {
        const nullableLocalLastTimeGotExperience =
          this.lastTimeGotExperience.currentLocal(rawGuild);
        const currentLocalLastTimeGotExperience =
          nullableLocalLastTimeGotExperience ?? dateNow;
        const localDifference = intervalToDuration({
          start: currentLocalLastTimeGotExperience,
          end: dateNow,
        });
        const guildMinMinutesForExperiences =
          DBUser.MIN_MINUTES_FOR_EXPERIENCE_GLOBAL;
        if (
          !nullableLocalLastTimeGotExperience ||
          (localDifference.minutes &&
            localDifference.minutes >= guildMinMinutesForExperiences)
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
