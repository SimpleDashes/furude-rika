import { CommandPreconditions, Preconditions } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
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
