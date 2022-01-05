import { differenceInMilliseconds } from 'date-fns';
import DBReminder from '../database/entity/DBReminder';
import DBUser from '../database/entity/DBUser';
import MessageCreator from '../framework/helpers/MessageCreator';
import FurudeLocales from '../localization/FurudeLocales';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';
import FurudeRika from './FurudeRika';

export default class ReminderManager {
  private static rika: FurudeRika;

  public static reminders: DBReminder[] = [];

  public static async setupReminders(rika: FurudeRika) {
    this.rika = rika;
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

  public static addReminder(reminder: DBReminder, localizer: FurudeLocales) {
    this.reminders.push(reminder);
    setTimeout(async () => {
      if (!this.reminders.includes(reminder)) return;
      const user = await this.rika.users.fetch(reminder.reminder_owner);
      await user.send({
        content: MessageCreator.success(
          localizer.get(FurudeTranslationKeys.REMINDER_REMINDING_YOU, [
            reminder.reminder,
          ])
        ),
      });
      await reminder.remove();
      this.removeReminder(reminder);
    }, differenceInMilliseconds(reminder.remind_end_date, reminder.remind_start_date));
  }

  public static removeReminder(reminder: DBReminder) {
    this.reminders = this.reminders.filter((r) => r != reminder);
  }
}
