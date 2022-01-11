import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import SubCommand from '../../modules/framework/commands/SubCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import IFurudeCommand from './interfaces/IFurudeCommand';
import ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';

export default abstract class FurudeSubCommand<
    CTX extends DefaultContext = DefaultContext
  >
  extends SubCommand<FurudeRika, DefaultContext>
  implements IFurudeCommand<DefaultContext>
{
  public abstract override trigger(context: CTX): Promise<void>;

  public createContext(baseContext: ICommandContext<FurudeRika>): CTX {
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
