import { differenceInMilliseconds } from 'date-fns';
import type { User } from 'discord.js';
import DBReminder from '../database/entity/DBReminder';
import MessageCreator from '../utils/MessageCreator';
import BaseFurudeManager from './abstracts/BaseFurudeManager';
import type DBUser from '../database/entity/DBUser';

export default class ReminderManager extends BaseFurudeManager {
  public reminders: DBReminder[] = [];

  public async setupReminders(): Promise<void> {
    const reminders = await DBReminder.find();
    const dbUsers = await this.rika.db.USER.find({
      where: {
        s_id: { $in: reminders.map((r) => r.reminder_owner) },
      },
    });
    for (const user of dbUsers) {
      const userReminders = reminders.filter(
        (r) => r.reminder_owner === user.s_id
      );
      this.addReminders(user, ...userReminders);
    }
  }

  public addReminders(databaseUser: DBUser, ...reminders: DBReminder[]): void {
    this.reminders.push(...reminders);
    for (const reminder of reminders) {
      setTimeout(async () => {
        if (!this.reminders.includes(reminder)) return;

        let user: User;
        try {
          user = await this.rika.users.fetch(reminder.reminder_owner);
        } catch {
          await this.removeReminder(reminder);
          return;
        }

        await user.send(
          MessageCreator.success(
            this.rika.localizer.getTranslation(
              databaseUser.preferred_locale,
              (k) => k.reminder.reminding,
              {
                CONTENT: reminder.reminder,
              }
            )
          )
        );

        await this.removeReminder(reminder);
      }, differenceInMilliseconds(reminder.remind_end_date, new Date()));
    }
  }

  public async removeReminder(reminder: DBReminder): Promise<void> {
    await reminder.remove();
    this.reminders = this.reminders.filter((r) => r != reminder);
  }
}
