import { CommandInformation } from 'discowork/src/commands/decorators';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';

import DailySubCommand from '../../wrapper/DailySubCommand';
import { MustHaveOpenAccount } from '../../wrapper/EconomySubCommand';

@CommandPreconditions(Preconditions.GuildOnly, MustHaveOpenAccount)
@CommandInformation({
  name: 'local',
  description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} for the current guild you are in.`,
})
export default class DailyLocal extends DailySubCommand {
  public dailyScope(): HyperTypes {
    return HyperTypes.local;
  }
}
