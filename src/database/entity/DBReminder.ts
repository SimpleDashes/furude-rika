import { addDays, addHours, addMinutes, addSeconds, addWeeks } from 'date-fns';
import type { Snowflake, User } from 'discord.js';
import { Column, Entity } from 'typeorm';
import type FurudeRika from '../../client/FurudeRika';
import Strings from '../../containers/Strings';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import Numbers from '../../modules/framework/helpers/Numbers';
import FurudeOperations from '../FurudeOperations';
import type IDatabaseOperation from '../interfaces/IDatabaseOperation';
import GeneratedIDEntity from './abstracts/GeneratedIDEntity';
import type DefaultContext from '../../contexts/DefaultContext';

@Entity()
export default class DBReminder extends GeneratedIDEntity {
  public static readonly MAX_NUMBER_OF_REMINDERS = 10;

  @Column('date')
  public remind_start_date: Date = new Date();

  @Column('date')
  public remind_end_date: Date = new Date();

  @Column('string')
  public reminder: string = Strings.EMPTY;

  @Column('string')
  public reminder_owner: string = Strings.EMPTY;

  public build(user: User, remindWhat: string): this {
    this.reminder_owner = user.id;
    this.reminder = remindWhat;
    return this;
  }

  /**
   *
   * @param context The context of the reminder.
   * @param end_time When will the reminder fire.
   * @returns A operation.
   */
  public setupFire(
    context: DefaultContext<unknown>,
    end_time: {
      seconds?: number | null;
      minutes?: number | null;
      hours?: number | null;
      days?: number | null;
      weeks?: number | null;
    }
  ): IDatabaseOperation {
    const { client, dbUser } = context;
    const { localizer } = client;

    const allTimeFrames = Object.values(end_time);

    if (
      allTimeFrames.every((time) => Numbers.defaultOptionalNumber(time) <= 0)
    ) {
      return FurudeOperations.error(
        localizer.getTranslationFromContext(
          context,
          (k) => k.reminder.error.no_time_frame,
          {}
        )
      );
    }

    const userReminders = DBReminder.getAllRemindersForID(
      client,
      this.reminder_owner
    );

    if (userReminders.length > DBReminder.MAX_NUMBER_OF_REMINDERS) {
      return FurudeOperations.error(
        localizer.getTranslationFromContext(
          context,
          (k) => k.reminder.error.max_reached,
          {
            LIMIT: MessageCreator.block(
              DBReminder.MAX_NUMBER_OF_REMINDERS.toString()
            ),
          }
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

    client.reminderManager.addReminders(dbUser, this);

    return FurudeOperations.success(
      localizer.getTranslationFromContext(
        context,
        (k) => k.reminder.will_remind,
        {}
      )
    );
  }

  public static getAllRemindersForID(
    rika: FurudeRika,
    uid: Snowflake
  ): DBReminder[] {
    return rika.reminderManager.reminders.filter(
      (r) => r.reminder_owner == uid
    );
  }

  public static getAllRemindersForUser(
    rika: FurudeRika,
    user: User
  ): DBReminder[] {
    return rika.reminderManager.reminders.filter(
      (r) => r.reminder_owner == user.id
    );
  }
}
