import { addDays, addHours, addMinutes, addSeconds, addWeeks } from 'date-fns';
import type { Snowflake, User } from 'discord.js';

import type FurudeRika from '../../../../client/FurudeRika';
import Strings from '../../../../containers/Strings';
import MessageCreator from '../../../../utils/MessageCreator';
import NumberUtils from '../../../../utils/NumberUtils';
import FurudeOperations from '../../../FurudeOperations';
import type IDatabaseOperation from '../../../interfaces/IDatabaseOperation';
import GeneratedIDEntity from '../../abstracts/GeneratedIDEntity';
import type DefaultContext from '../../../../contexts/DefaultContext';
import { Entity, Column, ManyToOne } from 'typeorm';
import DBUser from './DBUser';

@Entity()
export default class DBReminder extends GeneratedIDEntity {
  public static readonly MAX_NUMBER_OF_REMINDERS = 10;

  @Column('date')
  public remind_start_date: Date = new Date();

  @Column('date')
  public remind_end_date: Date = new Date();

  @Column('string')
  public reminder: string = Strings.EMPTY;

  @ManyToOne(() => DBUser, (user) => user.reminders)
  public owner!: DBUser;

  public constructor(owner: DBUser, reminder: string) {
    super();
    if (owner && reminder) {
      this.owner = owner;
      this.reminder = reminder;
    }
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
      allTimeFrames.every(
        (time) => NumberUtils.defaultOptionalNumber(time) <= 0
      )
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
      this.owner.id
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
      NumberUtils.defaultOptionalNumber(end_time.seconds)
    );

    this.remind_end_date = addMinutes(
      this.remind_end_date,
      NumberUtils.defaultOptionalNumber(end_time.minutes)
    );

    this.remind_end_date = addHours(
      this.remind_end_date,
      NumberUtils.defaultOptionalNumber(end_time.hours)
    );

    this.remind_end_date = addDays(
      this.remind_end_date,
      NumberUtils.defaultOptionalNumber(end_time.days)
    );

    this.remind_end_date = addWeeks(
      this.remind_end_date,
      NumberUtils.defaultOptionalNumber(end_time.weeks)
    );

    dbUser.reminders.push(this);
    client.reminderManager.addReminders(this);

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
    return rika.reminderManager.reminders.filter((r) => r.owner.id == uid);
  }

  public static getAllRemindersForUser(
    rika: FurudeRika,
    user: User
  ): DBReminder[] {
    return rika.reminderManager.reminders.filter((r) => r.owner.id == user.id);
  }
}
