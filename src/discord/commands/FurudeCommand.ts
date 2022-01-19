import DefaultContext from '../../contexts/DefaultContext';
import type IFurudeCommand from './interfaces/IFurudeCommand';
import Command from 'discowork/src/commands/Command';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/src/commands/interfaces/CommandContext';
import type { ConstructorType } from 'discowork/src/types';

export default abstract class FurudeCommand<A, CTX extends DefaultContext<A>>
  extends Command<A, CTX>
  implements IFurudeCommand<A, CTX>
{
  public abstract override trigger(context: CTX): Promise<void>;

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
