import DefaultContext from '../../client/contexts/DefaultContext';
import SubCommandGroup from '../../modules/framework/commands/SubCommandGroup';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import IFurudeCommand from './interfaces/IFurudeCommand';
import ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';

export default abstract class FurudeCommandGroup<
    CTX extends DefaultContext = DefaultContext
  >
  extends SubCommandGroup<CTX>
  implements IFurudeCommand<CTX>
{
  public abstract override trigger(context: CTX): Promise<void>;

  public createContext(baseContext: ICommandContext): CTX {
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
