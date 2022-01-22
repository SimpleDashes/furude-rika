import { CommandPreconditions, Preconditions } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import type CurrencyContext from '../../contexts/currency/CurrencyContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';

@CommandPreconditions(Preconditions.RequiresSubCommand)
@CommandInformation({
  name: 'economy',
  description: 'Economy, related commands all of then here...',
})
export default class Economy extends FurudeCommand<
  unknown,
  CurrencyContext<unknown>
> {
  public createArguments(): unknown {
    return {};
  }

  public async trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
