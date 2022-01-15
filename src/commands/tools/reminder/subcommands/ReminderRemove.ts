import type DefaultContext from '../../../../client/contexts/DefaultContext';
import CommandOptions from '../../../../containers/CommandOptions';
import DBReminder from '../../../../database/entity/DBReminder';
import FurudeSubCommand from '../../../../discord/commands/FurudeSubCommand';
import MessageCreator from '../../../../modules/framework/helpers/MessageCreator';
import IntegerOption from '../../../../modules/framework/options/classes/IntegerOption';
import FurudeTranslationKeys from '../../../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../../../modules/framework/interactions/InteractionUtils';
import { assertDefined } from '../../../../modules/framework/types/TypeAssertions';
import type { TypedArgs } from '../../../../modules/framework/commands/contexts/types';

type Args = {
  index: IntegerOption;
};

export default class ReminderRemove extends FurudeSubCommand<
  DefaultContext<TypedArgs<Args>>,
  Args
> {
  public createArgs(): Args {
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

  public constructor() {
    super({
      name: 'remove',
      description: 'Removes a reminder by a index.',
    });
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
    const { client, interaction, localizer, args } = context;
    const { index } = args;

    assertDefined(index);

    const reminder = DBReminder.getAllRemindersForUser(
      client,
      interaction.user
    )[index - 1];

    if (!reminder) {
      await InteractionUtils.reply(
        interaction,
        MessageCreator.fail(
          localizer.get(FurudeTranslationKeys.REMINDER_REMOVE_FAIL, [
            MessageCreator.block(index.toString()),
          ])
        )
      );
      return;
    }

    await client.reminderManager.removeReminder(reminder);
    await InteractionUtils.reply(
      interaction,
      MessageCreator.success(
        localizer.get(FurudeTranslationKeys.REMINDER_REMOVE_SUCCESS, [
          MessageCreator.block(index.toString()),
        ])
      )
    );
  }
}
