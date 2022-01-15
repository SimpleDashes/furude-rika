import type DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeCommand from '../../../discord/commands/FurudeCommand';
import type { TypedArgs } from '../../../modules/framework/commands/contexts/types';
import {
  Preconditions,
  SetPreconditions,
} from '../../../modules/framework/preconditions/PreconditionDecorators';

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
