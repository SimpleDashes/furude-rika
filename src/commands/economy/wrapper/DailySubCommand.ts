import type CurrencyContext from '../../../contexts/currency/CurrencyContext';
import FurudeOperations from '../../../database/FurudeOperations';
import type IDatabaseOperation from '../../../database/interfaces/IDatabaseOperation';
import type { HyperTypes } from '../../../database/objects/hypervalues/HyperTypes';
import EconomySubCommand from './EconomySubCommand';

export type DailyArgs = unknown;
export default abstract class DailySubCommand extends EconomySubCommand<DailyArgs> {
  public createArguments(): DailyArgs {
    return {};
  }

  public async trigger(context: CurrencyContext<DailyArgs>): Promise<void> {
    const { dbUser, interaction } = context;
    const { citizen } = dbUser;

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
