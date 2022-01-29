import { differenceInMilliseconds } from 'date-fns';
import type { User } from 'discord.js';
import DBReminder from '../database/entity/discord/user/DBReminder';
import MessageCreator from '../utils/MessageCreator';
import BaseFurudeManager from './abstracts/BaseFurudeManager';

export default class ReminderManager extends BaseFurudeManager {
  public reminders: DBReminder[] = [];

  public async setupReminders(): Promise<void> {
    const reminders = await DBReminder.find({ relations: ['owner'] });
    this.addReminders(...reminders);
  }

  public addReminders(...reminders: DBReminder[]): void {
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
