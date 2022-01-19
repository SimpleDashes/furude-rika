import { CommandInformation } from 'discowork/src/commands/decorators';
import { CommandPreconditions } from 'discowork/src/preconditions';
import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';
import DailySubCommand from '../../wrapper/DailySubCommand';
import { MustHaveOpenAccount } from '../../wrapper/EconomySubCommand';
@CommandPreconditions(MustHaveOpenAccount)
@CommandInformation({
  name: 'global',
  description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} globally.`,
})
export default class DailyGlobal extends DailySubCommand {
  public dailyScope(): HyperTypes {
    return HyperTypes.global;
  }
}
