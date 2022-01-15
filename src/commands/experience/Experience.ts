import type DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import type { TypedArgs } from '../../modules/framework/commands/contexts/types';
import {
  Preconditions,
  SetPreconditions,
} from '../../modules/framework/preconditions/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class Experience extends FurudeCommand<
  DefaultContext<TypedArgs<unknown>>,
  unknown
> {
  public createArgs(): unknown {
    return {};
  }

  public constructor() {
    super({
      name: 'experience',
      description: '.',
    });
  }

  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
