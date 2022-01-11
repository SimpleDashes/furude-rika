import DefaultContext from '../../../client/contexts/DefaultContext';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import DBCitizen from '../../../database/entity/DBCitizen';
import FurudeCommandGroup from '../../../discord/commands/FurudeCommandGroup';
import {
  Preconditions,
  SetPreconditions,
} from '../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class EconomyDaily extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'daily',
      description: `Collect your daily ${DBCitizen.AMOUNT_DAILY} ${CurrencyContainer.CURRENCY_NAME}'s, with a special bounty when you get to a ${DBCitizen.WEEKLY_STREAK} streak!`,
    });
  }

  public async trigger(_context: DefaultContext): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
