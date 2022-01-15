import type DefaultContext from '../../client/contexts/DefaultContext';
import SubCommand from '../../modules/framework/commands/SubCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import type IFurudeCommand from './interfaces/IFurudeCommand';
import type { OmittedCommandContext } from '../../modules/framework/commands/contexts/ICommandContext';
import type { TypedArgs } from '../../modules/framework/commands/contexts/types';

export default abstract class FurudeSubCommand<
    CTX extends DefaultContext<TypedArgs<A>>,
    A
  >
  extends SubCommand<CTX, A>
  implements IFurudeCommand<CTX, A>
{
  public abstract override trigger(context: CTX): Promise<void>;

  public createContext(baseContext: OmittedCommandContext): CTX {
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
