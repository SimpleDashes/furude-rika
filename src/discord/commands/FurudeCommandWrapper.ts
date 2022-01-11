import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';

export default class FurudeCommandWrapper {
  public static defaultContext(
    baseContext: ICommandContext<FurudeRika>
  ): DefaultContext {
    return new DefaultContext(baseContext);
  }
}
