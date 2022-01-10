import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import FurudeOperations from '../../../database/FurudeOperations';
import IDatabaseOperation from '../../../database/interfaces/IDatabaseOperation';
import { HyperTypes } from '../../../database/objects/hypervalues/HyperTypes';
import ICommandInformation from '../../../modules/framework/commands/interfaces/ICommandInformation';
import IHasPreconditions from '../../../modules/framework/commands/preconditions/interfaces/IHasPreconditions';
import EconomySubCommand, {
  EconomyRunner,
  MustHaveOpenAccount,
} from './EconomySubCommand';

export default abstract class DailySubCommand extends EconomySubCommand {
  public constructor(information: ICommandInformation) {
    super(information);
    if (
      !(this as unknown as IHasPreconditions).preconditions.includes(
        MustHaveOpenAccount
      )
    ) {
      throw 'DailySubCommand implementations should include MustHaveOpenAccount precondition.';
    }
  }

  public createRunnerRunnable(
    runner: EconomyRunner,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const scope = this.dailyScope();
      const citizen = runner.args!.citizen;

      const baseOperation = citizen.claimDaily(
        interaction,
        runner.args!.localizer,
        scope
      );

      const operation: IDatabaseOperation = {
        ...baseOperation,
        ...{
          response: `${scope.toUpperCase()}: ${baseOperation.response}`,
        },
      };

      await FurudeOperations.saveWhenSuccess(citizen, operation);
      await FurudeOperations.answerInteraction(interaction, operation);
    };
  }

  public abstract dailyScope(): HyperTypes;
}
