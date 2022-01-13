import DefaultContext from '../../client/contexts/DefaultContext';
import type { OmittedCommandContext } from '../../modules/framework/commands/interfaces/ICommandContext';

export default class FurudeCommandWrapper {
  public static defaultContext(
    baseContext: OmittedCommandContext
  ): DefaultContext {
    return new DefaultContext(baseContext);
  }
}
