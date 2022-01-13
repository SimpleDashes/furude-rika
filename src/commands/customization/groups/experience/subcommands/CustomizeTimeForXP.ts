import DefaultContext from '../../../../../client/contexts/DefaultContext';
import CommandOptions from '../../../../../containers/CommandOptions';
import DBUser from '../../../../../database/entity/DBUser';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/commands/decorators/PreconditionDecorators';
import IntegerOption from '../../../../../modules/framework/options/classes/IntegerOption';
import { assertDefined } from '../../../../../modules/framework/types/TypeAssertions';

@SetPreconditions(Preconditions.WithPermission('ADMINISTRATOR'))
export default class CustomizeTimeForXP extends FurudeSubCommand {
  private secondsOption = this.registerOption(
    new IntegerOption()
      .setRequired(true)
      .setName(CommandOptions.seconds)
      .setMinValue(DBUser.MIN_MIN_SECONDS_FOR_EXPERIENCE)
      .setMaxValue(DBUser.MAX_MIN_SECONDS_FOR_EXPERIENCE)
      .setDescription(
        'The number of seconds required for a user to be rewarded with experience on the guild.'
      )
  );

  public constructor() {
    super({
      name: 'time_for_xp',
      description:
        'Customizes how much time the users are required to wait before gaining any xp on a conversation.',
    });
  }

  public async trigger(context: DefaultContext): Promise<void> {
    const { interaction, localizer, dbGuild } = context;

    assertDefined(dbGuild);

    const secondsForXP = this.secondsOption.apply(interaction);
    assertDefined(secondsForXP);

    const operation = dbGuild.setTimeForXP(localizer, secondsForXP);

    await FurudeOperations.saveWhenSuccess(dbGuild);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
