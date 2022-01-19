import DefaultContext from '../../contexts/DefaultContext';
import type IFurudeCommand from './interfaces/IFurudeCommand';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/src/commands/interfaces/CommandContext';
import SubCommand from 'discowork/src/commands/SubCommand';
import type { ConstructorType } from 'discowork/src/types';

export default abstract class FurudeCommand<A, CTX extends DefaultContext<A>>
  extends SubCommand<A, CTX>
  implements IFurudeCommand<A, CTX>
{
  public abstract override trigger(context: CTX): Promise<void>;

  // TODO FIX TYPING
  public contextConstructor(): ConstructorType<
    [CommandContextOnlyInteractionAndClient],
    CTX
  > {
    return DefaultContext as ConstructorType<
      [CommandContextOnlyInteractionAndClient],
      CTX
    >;
  }
}
