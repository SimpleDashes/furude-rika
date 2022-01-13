import DefaultContext from '../../client/contexts/DefaultContext';
import SubCommand from '../../modules/framework/commands/SubCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import IFurudeCommand from './interfaces/IFurudeCommand';
import ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';

export default abstract class FurudeSubCommand<
    CTX extends DefaultContext = DefaultContext
  >
  extends SubCommand<CTX>
  implements IFurudeCommand<CTX>
{
  public abstract override trigger(context: CTX): Promise<void>;

  public createContext(baseContext: ICommandContext): CTX {
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
