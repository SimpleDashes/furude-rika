import { differenceInMilliseconds } from 'date-fns';
import { User } from 'discord.js';
import DBReminder from '../../database/entity/DBReminder';
import DBUser from '../../database/entity/DBUser';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import BaseFurudeManager from './abstracts/BaseFurudeManager';

export default class ReminderManager extends BaseFurudeManager {
  public reminders: DBReminder[] = [];

  public async setupReminders() {
    const reminders = await DBReminder.find();
    for (const reminder of reminders) {
      const dbUser = await DBUser.findOne({ s_id: reminder.reminder_owner });
      if (dbUser) {
        this.addReminder(
          reminder,
          new FurudeLocales({ language: dbUser.preferred_locale! })
        );
      }
    }
  }

  public async addReminder(reminder: DBReminder, localizer: FurudeLocales) {
    this.reminders.push(reminder);
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

  public async removeReminder(reminder: DBReminder) {
    await reminder.remove();
    this.reminders = this.reminders.filter((r) => r != reminder);
  }
}
