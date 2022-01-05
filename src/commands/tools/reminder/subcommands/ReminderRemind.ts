import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../../client/contexts/DefaultContext';
import FurudeRika from '../../../../client/FurudeRika';
import CommandOptions from '../../../../containers/CommandOptions';
import TimeFrames from '../../../../containers/TimeFrames';
import DBReminder from '../../../../database/entity/DBReminder';
import FurudeOperations from '../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../../discord/commands/interfaces/IFurudeRunner';
import IntegerOption from '../../../../framework/options/classes/IntegerOption';
import StringOption from '../../../../framework/options/classes/StringOption';

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

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const remindWhat = this.remindWhatOption.apply(interaction)!;

      const seconds = this.secondsOption.apply(interaction);
      const minutes = this.minutesOption.apply(interaction);
      const hours = this.hoursOption.apply(interaction);
      const days = this.daysOption.apply(interaction);
      const weeks = this.weeksOption.apply(interaction);

      const reminder = DBReminder.create().build(interaction.user, remindWhat);

      const operation = reminder.fireReminderWhen(
        client,
        runner.args!.localizer,
        {
          seconds,
          minutes,
          hours,
          days,
          weeks,
        }
      );

      await FurudeOperations.saveWhenSuccess(reminder, operation);
      await FurudeOperations.answerInteraction(interaction, operation);
    };
  }
}
