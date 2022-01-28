import { CommandPreconditions, Preconditions } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import CurrencyContainer from '../../../../containers/CurrencyContainer';
import DBCitizen from '../../../../database/entity/discord/user/DBCitizen';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';

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
