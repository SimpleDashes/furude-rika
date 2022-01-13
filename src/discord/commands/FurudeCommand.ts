import type DefaultContext from '../../client/contexts/DefaultContext';
import BaseCommand from '../../modules/framework/commands/BaseCommand';
import type IFurudeCommand from './interfaces/IFurudeCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import type { OmittedCommandContext } from '../../modules/framework/commands/interfaces/ICommandContext';

export default abstract class FurudeCommand<CTX extends DefaultContext>
  extends BaseCommand<CTX>
  implements IFurudeCommand<CTX>
{
  public abstract override trigger(context: CTX): Promise<void>;

  public createContext(baseContext: OmittedCommandContext): CTX {
    // TODO THAT CASTING IS A WORKAROUND, PROPER TYPING IS NEEDED ON FUTURE.
    return FurudeCommandWrapper.defaultContext(baseContext) as CTX;
  }
}
