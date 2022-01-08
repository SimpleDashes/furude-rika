import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../../../client/contexts/DefaultContext';
import FurudeRika from '../../../../../client/FurudeRika';
import CommandOptions from '../../../../../containers/CommandOptions';
import DBUser from '../../../../../database/entity/DBUser';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import {
  RequirePermissions,
  RequiresGuild,
} from '../../../../../modules/framework/commands/decorators/PreconditionDecorators';
import IntegerOption from '../../../../../modules/framework/options/classes/IntegerOption';

@RequiresGuild
@RequirePermissions(['ADMINISTRATOR'])
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

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const secondsForXP = this.secondsOption.apply(interaction)!;

      const operation = runner.args!.dbGuild!.setTimeForXP(
        runner.args!.localizer,
        secondsForXP
      );

      await FurudeOperations.saveWhenSuccess(runner.args!.dbGuild!);
      await FurudeOperations.answerInteraction(interaction, operation);
    };
  }
}
