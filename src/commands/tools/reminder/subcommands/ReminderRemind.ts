import DefaultContext from '../../../../client/contexts/DefaultContext';
import CommandOptions from '../../../../containers/CommandOptions';
import TimeFrames from '../../../../containers/TimeFrames';
import DBReminder from '../../../../database/entity/DBReminder';
import FurudeOperations from '../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../discord/commands/FurudeSubCommand';
import IntegerOption from '../../../../modules/framework/options/classes/IntegerOption';
import StringOption from '../../../../modules/framework/options/classes/StringOption';
import { assertDefinedGet } from '../../../../modules/framework/types/TypeAssertions';

class ReminderTimeOption extends IntegerOption {
  public constructor(name: CommandOptions) {
    super();
    this.setName(name);
    this.setDescription(
      `The number of ${name} required for you to be reminded.`
    );
  }
}

export default class ReminderReminderMe extends FurudeSubCommand {
  private remindWhatOption = this.registerOption(
    new StringOption()
      .setRequired(true)
      .setName(CommandOptions.reminder)
      .setDescription('The reminder you want to be reminded on.')
  );

  private secondsOption = this.registerOption(
    new ReminderTimeOption(CommandOptions.seconds).setMaxValue(
      TimeFrames.SECONDS_ON_MINUTE
    )
  );

  private minutesOption = this.registerOption(
    new ReminderTimeOption(CommandOptions.minutes).setMaxValue(
      TimeFrames.MINUTES_ON_HOUR
    )
  );

  private hoursOption = this.registerOption(
    new ReminderTimeOption(CommandOptions.hours).setMaxValue(
      TimeFrames.HOURS_ON_DAY
    )
  );

  private daysOption = this.registerOption(
    new ReminderTimeOption(CommandOptions.days).setMaxValue(
      TimeFrames.DAYS_ON_WEEK
    )
  );

  private weeksOption = this.registerOption(
    new ReminderTimeOption(CommandOptions.weeks).setMaxValue(
      TimeFrames.WEEKS_ON_MONTH
    )
  );

  public constructor() {
    super({
      name: 'remind',
      description:
        'Setups a little reminder for you to get your lazy uwu working on next time.',
    });
  }

  public async trigger(context: DefaultContext): Promise<void> {
    const { interaction, client, localizer } = context;

    const remindWhat = assertDefinedGet(
      this.remindWhatOption.apply(interaction)
    );

    const seconds = this.secondsOption.apply(interaction);
    const minutes = this.minutesOption.apply(interaction);
    const hours = this.hoursOption.apply(interaction);
    const days = this.daysOption.apply(interaction);
    const weeks = this.weeksOption.apply(interaction);

    const reminder = DBReminder.create().build(interaction.user, remindWhat);

    const operation = reminder.fireReminderWhen(client, localizer, {
      seconds,
      minutes,
      hours,
      days,
      weeks,
    });

    await FurudeOperations.saveWhenSuccess(reminder, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
