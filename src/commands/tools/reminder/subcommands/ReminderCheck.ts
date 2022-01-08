import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../../client/contexts/DefaultContext';
import FurudeRika from '../../../../client/FurudeRika';
import CommandOptions from '../../../../containers/CommandOptions';
import Strings from '../../../../containers/Strings';
import DBReminder from '../../../../database/entity/DBReminder';
import FurudeSubCommand from '../../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../../discord/commands/interfaces/IFurudeRunner';
import BaseEmbed from '../../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../../modules/framework/helpers/MessageCreator';
import UserOption from '../../../../modules/framework/options/classes/UserOption';
import FurudeTranslationKeys from '../../../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../../../modules/framework/interactions/InteractionUtils';

export default class ReminderCheck extends FurudeSubCommand {
  public static MAX_REMINDER_LENGTH = 16;

  private readonly userOption: UserOption = this.registerOption(
    new UserOption(true)
      .setName(CommandOptions.user)
      .setDescription('The user you want to check the reminders.')
  );

  public constructor() {
    super({
      name: 'check',
      description: 'Check all your pending reminders.',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const user = this.userOption.apply(interaction)!;
      const reminders = DBReminder.getAllRemindersForUser(client, user);

      let allReminders = Strings.EMPTY;
      if (reminders.length > 0) {
        for (let i = 0; i < reminders.length; i++) {
          const reminder = reminders[i]!;
          allReminders += `${i + 1} - `;
          let displayContent = reminder.reminder
            .trim()
            .substring(0, ReminderCheck.MAX_REMINDER_LENGTH);
          if (displayContent.length >= ReminderCheck.MAX_REMINDER_LENGTH) {
            displayContent += '...';
          }
          allReminders += runner.args!.localizer.get(
            FurudeTranslationKeys.REMINDER_WILL_FIRE,
            [
              MessageCreator.block(displayContent),
              MessageCreator.timeStamp(reminder.remind_end_date),
            ]
          );
          allReminders += '\n';
        }
      } else {
        allReminders = runner.args!.localizer.get(
          FurudeTranslationKeys.NOTHING_HERE
        );
      }

      allReminders = MessageCreator.bold(allReminders);

      const embed = new BaseEmbed(
        {
          title: MessageCreator.bold(
            runner.args!.localizer.get(FurudeTranslationKeys.REMINDERS_STRING, [
              user.username,
            ])
          ),
          description: allReminders,
        },
        interaction
      );

      await InteractionUtils.reply(interaction, {
        embeds: [embed],
      });
    };
  }
}
