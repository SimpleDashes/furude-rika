import type CommandWithPreconditions from 'discowork/src/preconditions/interfaces/CommandWithPreconditions';
import type CurrencyContext from '../../../contexts/currency/CurrencyContext';
import FurudeOperations from '../../../database/FurudeOperations';
import type IDatabaseOperation from '../../../database/interfaces/IDatabaseOperation';
import type { HyperTypes } from '../../../database/objects/hypervalues/HyperTypes';
import EconomySubCommand, { MustHaveOpenAccount } from './EconomySubCommand';

export type DailyArgs = unknown;
export default abstract class DailySubCommand extends EconomySubCommand<DailyArgs> {
  public createArguments(): DailyArgs {
    return {};
  }

  public constructor() {
    super();
    if (
      !(this as unknown as CommandWithPreconditions).preconditions.includes(
        MustHaveOpenAccount
      )
    ) {
      throw 'DailySubCommand implementations should include MustHaveOpenAccount precondition.';
    }
  }

  public async trigger(context: CurrencyContext<DailyArgs>): Promise<void> {
    const { citizen, interaction } = context;

    const scope = this.dailyScope();

    const baseOperation = citizen.claimDaily(context, scope);

    const operation: IDatabaseOperation = {
      ...baseOperation,
      ...{
        response: `${scope.toUpperCase()}: ${baseOperation.response}`,
      },
    };

    await FurudeOperations.saveWhenSuccess(citizen, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }

  public abstract dailyScope(): HyperTypes;
}
