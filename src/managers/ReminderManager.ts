import { differenceInMilliseconds } from 'date-fns';
import type { User } from 'discord.js';
import DBReminder from '../database/entity/user/DBReminder';
import MessageCreator from '../utils/MessageCreator';
import BaseFurudeManager from './abstracts/BaseFurudeManager';
import { assertDefined } from 'discowork';
import assert from 'assert';

export default class ReminderManager extends BaseFurudeManager {
  public reminders: DBReminder[] = [];

  public async setupReminders(): Promise<void> {
    const reminders = await DBReminder.find();
    const users = await this.rika.db.USER.find({
      where: {
        id: { $in: reminders.map((r) => r.owner) },
      },
    });
    users.forEach((user) => {
      const userReminders = reminders.filter((r) => r.owner.id === user.id);
      this.addReminders(...userReminders);
    });
  }

  public addReminders(...reminders: DBReminder[]): void {
    const firstEntry = reminders[0];
    assertDefined(firstEntry);
    const owner = firstEntry.owner;
    assert(reminders.every((reminder) => reminder.owner === owner));
    this.reminders.push(...reminders);
    reminders.forEach((reminder) => {
      setTimeout(async () => {
        if (!this.reminders.includes(reminder)) return;

        let user: User;
        try {
          user = await this.rika.users.fetch(reminder.owner.id);
        } catch {
          await this.removeReminder(reminder);
          return;
        }

        await user.send(
          MessageCreator.success(
            this.rika.localizer.getTranslation(
              reminder.owner.preferred_locale,
              (k) => k.reminder.reminding,
              {
                CONTENT: reminder.reminder,
              }
            )
          )
        );

        await this.removeReminder(reminder);
      }, differenceInMilliseconds(reminder.remind_end_date, new Date()));
    });
  }

  public async removeReminder(reminder: DBReminder): Promise<void> {
    await reminder.remove();
    this.reminders = this.reminders.filter((r) => r != reminder);
  }
}
