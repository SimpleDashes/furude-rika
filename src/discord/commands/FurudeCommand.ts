import DefaultContext from '../../client/contexts/DefaultContext';
import BaseCommand from '../../modules/framework/commands/BaseCommand';
import IFurudeCommand from './interfaces/IFurudeCommand';
import ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';
import FurudeCommandWrapper from './FurudeCommandWrapper';

export default abstract class FurudeCommand<
    CTX extends DefaultContext = DefaultContext
  >
  extends BaseCommand<CTX>
  implements IFurudeCommand<CTX>
{
  public abstract override trigger(context: CTX): Promise<void>;

  public createContext(baseContext: ICommandContext): CTX {
    // TODO THAT CASTING IS A WORKAROUND, PROPER TYPING IS NEEDED ON FUTURE.
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
