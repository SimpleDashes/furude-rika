import FurudeRika from '../../../client/FurudeRika';
import DefaultDependency from '../../../client/providers/DefaultDependency';
import IRunsCommand from '../../../framework/commands/interfaces/IRunsCommand';

export default interface IFurudeRunner<T extends DefaultDependency>
  extends IRunsCommand<FurudeRika> {
  args?: T;
}
