import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../../client/contexts/DefaultContext';
import FurudeRika from '../../../../client/FurudeRika';
import CommandOptions from '../../../../containers/CommandOptions';
import DBReminder from '../../../../database/entity/DBReminder';
import FurudeSubCommand from '../../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../../discord/commands/interfaces/IFurudeRunner';
import MessageCreator from '../../../../modules/framework/helpers/MessageCreator';
import IntegerOption from '../../../../modules/framework/options/classes/IntegerOption';
import FurudeTranslationKeys from '../../../../localization/FurudeTranslationKeys';

export default class ReminderRemove extends FurudeSubCommand {
  public indexOption = this.registerOption(
    new IntegerOption()
      .setRequired(true)
      .setName(CommandOptions.index)
      .setDescription(
        'The index of the reminder you want to remove. Check it through `/reminder check`.'
      )
      .setMaxValue(DBReminder.MAX_NUMBER_OF_REMINDERS)
  );

  public constructor() {
    super({
      name: 'remove',
      description: 'Removes a reminder by a index.',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const index = this.indexOption.apply(interaction)!;
      const reminder = DBReminder.getAllRemindersForUser(
        client,
        interaction.user
      )[index - 1];

      if (!reminder) {
        await interaction.editReply(
          MessageCreator.error(
            runner.args!.localizer.get(
              FurudeTranslationKeys.REMINDER_REMOVE_FAIL,
              [MessageCreator.block(index.toString())]
            )
          )
        );
        return;
      }

      await client.reminderManager.removeReminder(reminder);
      await interaction.editReply(
        MessageCreator.success(
          runner.args!.localizer.get(
            FurudeTranslationKeys.REMINDER_REMOVE_SUCCESS,
            [MessageCreator.block(index.toString())]
          )
        )
      );
    };
  }
}
