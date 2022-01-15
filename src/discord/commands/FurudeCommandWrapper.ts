import DefaultContext from '../../client/contexts/DefaultContext';
import type { OmittedCommandContext } from '../../modules/framework/commands/contexts/ICommandContext';

export default class FurudeCommandWrapper {
  public static defaultContext(
    baseContext: OmittedCommandContext
  ): DefaultContext<unknown> {
    return new DefaultContext(baseContext);
  }
}
