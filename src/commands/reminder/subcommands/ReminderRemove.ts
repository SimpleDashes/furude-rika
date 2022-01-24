import type DefaultContext from '../../../contexts/DefaultContext';
import CommandOptions from '../../../containers/CommandOptions';
import DBReminder from '../../../database/entity/DBReminder';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import MessageCreator from '../../../utils/MessageCreator';
import type { TypedArgs } from 'discowork';
import { assertDefined } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import IntegerOption from 'discowork/lib/options/classes/IntegerOption';
import InteractionUtils from 'discowork/lib/utils/InteractionUtils';

type Args = {
  index: IntegerOption;
};

@CommandInformation({
  name: 'remove',
  description: 'Removes a reminder by a index.',
})
export default class ReminderRemove extends FurudeSubCommand<
  Args,
  DefaultContext<Args>
> {
  public createArguments(): Args {
    return {
      index: new IntegerOption()
        .setRequired(true)
        .setName(CommandOptions.index)
        .setDescription(
          'The index of the reminder you want to remove. Check it through `/reminder check`.'
        )
        .setMaxValue(DBReminder.MAX_NUMBER_OF_REMINDERS),
    };
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
    const { client, interaction, args } = context;
    const { localizer } = client;
    const { index } = args;

    assertDefined(index);

    const reminder = DBReminder.getAllRemindersForUser(
      client,
      interaction.user
    )[index - 1];

    const textIndex = MessageCreator.block(index.toString());

    if (!reminder) {
      await InteractionUtils.reply(
        interaction,
        MessageCreator.fail(
          localizer.getTranslationFromContext(
            context,
            (k) => k.reminder.remove.fail,
            {
              INDEX: textIndex,
            }
          )
        )
      );
      return;
    }

    await client.reminderManager.removeReminder(reminder);
    await InteractionUtils.reply(
      interaction,
      MessageCreator.success(
        localizer.getTranslationFromContext(
          context,
          (k) => k.reminder.remove.success,
          {
            INDEX: textIndex,
          }
        )
      )
    );
  }
}
