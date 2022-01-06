import FurudeRika from '../../../client/FurudeRika';
import DefaultContext from '../../../client/contexts/DefaultContext';
import IRunsCommand from '../../../modules/framework/commands/interfaces/IRunsCommand';

export default interface IFurudeRunner<T extends DefaultContext>
  extends IRunsCommand<FurudeRika> {
  args?: T;
}
