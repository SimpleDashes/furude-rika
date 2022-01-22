import { CommandPreconditions } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';
import DailySubCommand from '../../wrapper/DailySubCommand';
import { MustHaveOpenAccount } from '../../wrapper/EconomySubCommand';
@CommandPreconditions(MustHaveOpenAccount)
@CommandInformation({
  name: HyperTypes.global,
  description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} globally.`,
})
export default class DailyGlobal extends DailySubCommand {
  public dailyScope(): HyperTypes {
    return HyperTypes.global;
  }
}
