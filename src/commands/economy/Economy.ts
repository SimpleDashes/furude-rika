import { CommandInformation } from 'discowork/src/commands/decorators';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
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
