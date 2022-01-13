import { differenceInMilliseconds } from 'date-fns';
import { User } from 'discord.js';
import DBReminder from '../../database/entity/DBReminder';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import BaseFurudeManager from './abstracts/BaseFurudeManager';

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
      this.addReminders(
        new FurudeLocales({
          language: user.preferred_locale,
        }),
        ...userReminders
      );
    }
  }

  public addReminders(
    localizer: FurudeLocales,
    ...reminders: DBReminder[]
  ): void {
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
            localizer.get(FurudeTranslationKeys.REMINDER_REMINDING_YOU, [
              reminder.reminder,
            ])
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
