import {
  IntegerOption,
  CommandPreconditions,
  Preconditions,
  assertDefined,
} from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import CommandOptions from '../../../../../containers/CommandOptions';
import type DefaultContext from '../../../../../contexts/DefaultContext';
import DBUser from '../../../../../database/entity/DBUser';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';

type Args = {
  seconds: IntegerOption;
};
@CommandPreconditions(Preconditions.WithPermission('ADMINISTRATOR'))
@CommandInformation({
  name: 'time_for_xp',
  description:
    'Customizes how much time the users are required to wait before gaining any xp on a conversation.',
})
export default class CustomizeTimeForXP extends FurudeSubCommand<
  Args,
  DefaultContext<Args>
> {
  public createArguments(): Args {
    return {
      seconds: new IntegerOption()
        .setRequired(true)
        .setName(CommandOptions.seconds)
        .setMinValue(DBUser.MIN_MIN_SECONDS_FOR_EXPERIENCE)
        .setMaxValue(DBUser.MAX_MIN_SECONDS_FOR_EXPERIENCE)
        .setDescription(
          'The number of seconds required for a user to be rewarded with experience on the guild.'
        ),
    };
  }

  public async trigger(context: DefaultContext<Args>): Promise<void> {
    const { interaction, dbGuild, args } = context;
    const { seconds } = args;

    assertDefined(dbGuild);
    assertDefined(seconds);

    const operation = dbGuild.setTimeForXP(context, seconds);

    await FurudeOperations.saveWhenSuccess(dbGuild);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
