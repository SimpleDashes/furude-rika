import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';
import { SetPreconditions } from '../../../../modules/framework/preconditions/PreconditionDecorators';
import DailySubCommand from '../../wrapper/DailySubCommand';
import { MustHaveOpenAccount } from '../../wrapper/EconomySubCommand';

@SetPreconditions(MustHaveOpenAccount)
export default class DailyGlobal extends DailySubCommand {
  public constructor() {
    super({
      name: 'global',
      description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} globally.`,
    });
  }

  public dailyScope(): HyperTypes {
    return HyperTypes.global;
  }
}
