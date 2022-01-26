import type DefaultContext from '../../../contexts/DefaultContext';
import CommandOptions from '../../../containers/CommandOptions';
import TimeFrames from '../../../containers/TimeFrames';
import DBReminder from '../../../database/entity/user/DBReminder';
import FurudeOperations from '../../../database/FurudeOperations';
import type { TypedArgs } from 'discowork';
import { assertDefined } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import IntegerOption from 'discowork/lib/options/classes/IntegerOption';
import StringOption from 'discowork/lib/options/classes/StringOption';
import ReminderCommand from '../wrapper/ReminderCommand';
class ReminderTimeOption extends IntegerOption {
  public constructor(name: CommandOptions) {
    super();
    this.setName(name);
    this.setDescription(
      `The number of ${name} required for you to be reminded.`
    );
  }
}

type Args = {
  what: StringOption;
  seconds: ReminderTimeOption;
  minutes: ReminderTimeOption;
  hours: ReminderTimeOption;
  days: ReminderTimeOption;
  weeks: ReminderTimeOption;
};

@CommandInformation({
  name: 'remind',
  description:
    'Setups a little reminder for you to get your lazy uwu working on next time.',
})
export default class ReminderReminderMe extends ReminderCommand<Args> {
  public createArguments(): Args {
    return {
      what: new StringOption()
        .setRequired(true)
        .setName(CommandOptions.reminder)
        .setDescription('The reminder you want to be reminded on.'),
      seconds: new ReminderTimeOption(CommandOptions.seconds).setMaxValue(
        TimeFrames.SECONDS_ON_MINUTE
      ),
      minutes: new ReminderTimeOption(CommandOptions.minutes).setMaxValue(
        TimeFrames.MINUTES_ON_HOUR
      ),
      hours: new ReminderTimeOption(CommandOptions.hours).setMaxValue(
        TimeFrames.HOURS_ON_DAY
      ),
      days: new ReminderTimeOption(CommandOptions.days).setMaxValue(
        TimeFrames.DAYS_ON_WEEK
      ),
      weeks: new ReminderTimeOption(CommandOptions.weeks).setMaxValue(
        TimeFrames.WEEKS_ON_MONTH
      ),
    };
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
    const { interaction, args, dbUser } = context;
    const { what, seconds, minutes, hours, days, weeks } = args;

    assertDefined(what);

    const reminder = new DBReminder(dbUser, what);

    const operation = reminder.setupFire(context, {
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
