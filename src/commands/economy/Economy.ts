import type CurrencyContext from '../../client/contexts/currency/CurrencyContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import type { TypedArgs } from '../../modules/framework/commands/decorators/ContextDecorators';
import {
  Preconditions,
  SetPreconditions,
} from '../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class Economy extends FurudeCommand<
  CurrencyContext<TypedArgs<unknown>>,
  unknown
> {
  public createArgs(): unknown {
    return {};
  }

  public constructor() {
    super({
      name: 'economy',
      description: 'Economy, related commands all of then here...',
    });
  }

  public async trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
