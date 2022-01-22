import { SubCommand } from 'discowork';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/lib/commands/interfaces/CommandContext';
import type ConstructorType from 'discowork/lib/types/ConstructorType';
import DefaultContext from '../../contexts/DefaultContext';
import type IFurudeCommand from './interfaces/IFurudeCommand';

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
