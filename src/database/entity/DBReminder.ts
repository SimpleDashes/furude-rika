import { addDays, addHours, addMinutes, addSeconds, addWeeks } from 'date-fns';
import { Snowflake, User } from 'discord.js';
import { Column, Entity } from 'typeorm';
import FurudeRika from '../../client/FurudeRika';
import Strings from '../../containers/Strings';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import Numbers from '../../modules/framework/helpers/Numbers';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import FurudeOperations from '../FurudeOperations';
import IDatabaseOperation from '../interfaces/IDatabaseOperation';
import GeneratedIDEntity from './abstracts/GeneratedIDEntity';

@Entity()
export default class DBReminder extends GeneratedIDEntity {
  public static readonly MAX_NUMBER_OF_REMINDERS = 10;

  @Column('date')
  remind_start_date: Date = new Date();

  @Column('date')
  remind_end_date: Date = new Date();

  @Column('string')
  reminder: string = Strings.EMPTY;

  @Column('string')
  reminder_owner: string = Strings.EMPTY;

  public build(user: User, remindWhat: string): this {
    this.reminder_owner = user.id;
    this.reminder = remindWhat;
    return this;
  }

  public fireReminderWhen(
    rika: FurudeRika,
    localizer: FurudeLocales,
    end_time: {
      seconds?: number | null;
      minutes?: number | null;
      hours?: number | null;
      days?: number | null;
      weeks?: number | null;
    }
  ): IDatabaseOperation {
    const allTimeFrames = Object.values(end_time);

    if (
      allTimeFrames.every((time) => Numbers.defaultOptionalNumber(time) <= 0)
    ) {
      return FurudeOperations.error(
        localizer.get(FurudeTranslationKeys.REMINDER_NEEDS_TIME_FRAME)
      );
    }

    const userReminders = DBReminder.getAllRemindersForID(
      rika,
      this.reminder_owner
    );

    if (userReminders.length > DBReminder.MAX_NUMBER_OF_REMINDERS) {
      return FurudeOperations.error(
        localizer.get(
          FurudeTranslationKeys.REMINDER_MAX_NUMBER_OF_REMINDERS_REACHED,
          [MessageCreator.block(DBReminder.MAX_NUMBER_OF_REMINDERS.toString())]
        )
      );
    }

    this.remind_end_date = addSeconds(
      this.remind_end_date,
      Numbers.defaultOptionalNumber(end_time.seconds)
    );

    this.remind_end_date = addMinutes(
      this.remind_end_date,
      Numbers.defaultOptionalNumber(end_time.minutes)
    );

    this.remind_end_date = addHours(
      this.remind_end_date,
      Numbers.defaultOptionalNumber(end_time.hours)
    );

    this.remind_end_date = addDays(
      this.remind_end_date,
      Numbers.defaultOptionalNumber(end_time.days)
    );

    this.remind_end_date = addWeeks(
      this.remind_end_date,
      Numbers.defaultOptionalNumber(end_time.weeks)
    );

    rika.reminderManager.addReminders(localizer, this);

    return FurudeOperations.success(
      localizer.get(FurudeTranslationKeys.REMINDER_WILL_REMIND_YOU)
    );
  }

  private static getAllRemindersForID(rika: FurudeRika, uid: Snowflake) {
    return rika.reminderManager.reminders.filter(
      (r) => r.reminder_owner == uid
    );
  }

  public static getAllRemindersForUser(rika: FurudeRika, user: User) {
    return this.getAllRemindersForID(rika, user.id);
  }
}
