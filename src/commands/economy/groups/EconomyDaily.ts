import { CommandInformation } from 'discowork/src/commands/decorators';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import DBCitizen from '../../../database/entity/DBCitizen';
import FurudeCommandGroup from '../../../discord/commands/FurudeCommandGroup';

@CommandPreconditions(Preconditions.RequiresSubCommand)
@CommandInformation({
  name: 'daily',
  description: `Collect your daily ${DBCitizen.AMOUNT_DAILY} ${CurrencyContainer.CURRENCY_NAME}'s, with a special bounty when you get to a ${DBCitizen.WEEKLY_STREAK} streak!`,
})
export default class EconomyDaily extends FurudeCommandGroup {
  public async trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
