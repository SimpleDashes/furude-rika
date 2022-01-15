import type CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import FurudeOperations from '../../../database/FurudeOperations';
import type { TypedArgs } from '../../../modules/framework/commands/contexts/types';
import EconomySubCommand from '../wrapper/EconomySubCommand';

type Args = unknown;
export default class EconomyOpen extends EconomySubCommand<Args> {
  public createArgs(): unknown {
    return {};
  }

  static readonly #STARTING_CAPITAL = 100;

  public constructor() {
    super({
      name: 'open',
      description: `Opens a ${
        CurrencyContainer.CURRENCY_NAME
      } currency account. (Starting with ${EconomyOpen.#STARTING_CAPITAL} ${
        CurrencyContainer.CURRENCY_NAME
      }'s)`,
    });
  }

  public async trigger(
    context: CurrencyContext<TypedArgs<Args>>
  ): Promise<void> {
    const { citizen, interaction, localizer } = context;

    const operation = citizen.openAccount(localizer);

    await FurudeOperations.saveWhenSuccess(citizen, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
