import type DefaultContext from '../../client/contexts/DefaultContext';
import BaseCommand from '../../modules/framework/commands/BaseCommand';
import type IFurudeCommand from './interfaces/IFurudeCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import type { OmittedCommandContext } from '../../modules/framework/commands/contexts/ICommandContext';
import type { TypedArgs } from '../../modules/framework/commands/decorators/ContextDecorators';

export default abstract class FurudeCommand<
    CTX extends DefaultContext<TypedArgs<A>>,
    A
  >
  extends BaseCommand<CTX, A>
  implements IFurudeCommand<CTX, A>
{
  public abstract override trigger(context: CTX): Promise<void>;

  public createContext(baseContext: OmittedCommandContext): CTX {
    // TODO THAT CASTING IS A WORKAROUND, PROPER TYPING IS NEEDED ON FUTURE.
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
