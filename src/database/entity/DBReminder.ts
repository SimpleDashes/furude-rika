import { addDays, addHours, addMinutes, addSeconds, addWeeks } from 'date-fns';
import { User } from 'discord.js';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import ReminderManager from '../../client/ReminderManager';
import Strings from '../../containers/Strings';
import Numbers from '../../framework/helpers/Numbers';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import FurudeOperations from '../FurudeOperations';
import IDatabaseOperation from '../interfaces/IDatabaseOperation';

@Entity()
export default class DBReminder extends BaseEntity {
  public static readonly MAX_NUMBER_OF_REMINDERS = 10;

  @ObjectIdColumn({ generated: true })
  id!: string;

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

    if (
      ReminderManager.reminders.filter(
        (r) => r.reminder_owner == this.reminder_owner
      ).length > DBReminder.MAX_NUMBER_OF_REMINDERS
    ) {
      return FurudeOperations.error(
        localizer.get(
          FurudeTranslationKeys.REMINDER_MAX_NUMBER_OF_REMINDERS_REACHED,
          [DBReminder.MAX_NUMBER_OF_REMINDERS.toString()]
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

    ReminderManager.addReminder(this, localizer);

    return FurudeOperations.success(
      localizer.get(FurudeTranslationKeys.REMINDER_WILL_REMIND_YOU)
    );
  }
}
