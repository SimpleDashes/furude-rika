import type DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeCommand from '../../../discord/commands/FurudeCommand';
import type { TypedArgs } from '../../../modules/framework/commands/decorators/ContextDecorators';
import {
  Preconditions,
  SetPreconditions,
} from '../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class RemindMe extends FurudeCommand<
  DefaultContext<TypedArgs<unknown>>,
  unknown
> {
  public createArgs(): unknown {
    return {};
  }

  public constructor() {
    super({
      name: 'reminder',
      description:
        'Setups a little reminder for you to get your lazy uwu working on next time.',
    });
  }

  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
