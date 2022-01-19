import type CurrencyContext from '../../../contexts/currency/CurrencyContext';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import FurudeOperations from '../../../database/FurudeOperations';
import EconomySubCommand from '../wrapper/EconomySubCommand';
import DBCitizen from '../../../database/entity/DBCitizen';
import { CommandInformation } from 'discowork/src/commands/decorators';

type Args = unknown;

@CommandInformation({
  name: 'open',
  description: `Opens a ${CurrencyContainer.CURRENCY_NAME} currency account. (Starting with ${DBCitizen.STARTING_CAPITAL} ${CurrencyContainer.CURRENCY_NAME}'s)`,
})
export default class EconomyOpen extends EconomySubCommand<Args> {
  public createArguments(): unknown {
    return {};
  }

  public constructor() {
    super();
  }

  public async trigger(context: CurrencyContext<Args>): Promise<void> {
    const { citizen, interaction } = context;

    const operation = citizen.openAccount(context);

    await FurudeOperations.saveWhenSuccess(citizen, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
