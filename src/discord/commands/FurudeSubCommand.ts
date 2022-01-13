import type DefaultContext from '../../client/contexts/DefaultContext';
import SubCommand from '../../modules/framework/commands/SubCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import type IFurudeCommand from './interfaces/IFurudeCommand';
import type { OmittedCommandContext } from '../../modules/framework/commands/interfaces/ICommandContext';

export default abstract class FurudeSubCommand<
    CTX extends DefaultContext = DefaultContext
  >
  extends SubCommand<CTX>
  implements IFurudeCommand<CTX>
{
  public abstract override trigger(context: CTX): Promise<void>;

  public createContext(baseContext: OmittedCommandContext): CTX {
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
