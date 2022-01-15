import type CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import FurudeOperations from '../../../database/FurudeOperations';
import type IDatabaseOperation from '../../../database/interfaces/IDatabaseOperation';
import type { HyperTypes } from '../../../database/objects/hypervalues/HyperTypes';
export default class DailyHelper {
  public static async trigger(
    context: CurrencyContext<unknown>,
    type: HyperTypes
  ): Promise<void> {
    const { citizen, localizer, interaction } = context;

    const baseOperation = citizen.claimDaily(interaction, localizer, type);

    const operation: IDatabaseOperation = {
      ...baseOperation,
      ...{
        response: `${type.toUpperCase()}: ${baseOperation.response}`,
      },
    };

    await FurudeOperations.saveWhenSuccess(citizen, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
