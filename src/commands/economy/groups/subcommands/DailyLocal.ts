import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../modules/framework/commands/decorators/PreconditionDecorators';
import DailySubCommand from '../../wrapper/DailySubCommand';
import { MustHaveOpenAccount } from '../../wrapper/EconomySubCommand';

@SetPreconditions(Preconditions.GuildOnly, MustHaveOpenAccount)
export default class DailyLocal extends DailySubCommand {
  public constructor() {
    super({
      name: 'local',
      description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} for the current guild you are in.`,
    });
  }

  public dailyScope(): HyperTypes {
    return HyperTypes.local;
  }
}
