import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import BaseCommand from '../../modules/framework/commands/BaseCommand';
import IFurudeCommand from './interfaces/IFurudeCommand';
import ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';
import FurudeCommandWrapper from './FurudeCommandWrapper';

export default abstract class FurudeCommand<
    CTX extends DefaultContext = DefaultContext
  >
  extends BaseCommand<FurudeRika, DefaultContext>
  implements IFurudeCommand<DefaultContext>
{
  public abstract override trigger(context: DefaultContext): Promise<void>;

  public createContext(baseContext: ICommandContext<FurudeRika>): CTX {
    // TODO THAT CASTING IS A WORKAROUND, PROPER TYPING IS NEEDED ON FUTURE.
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
