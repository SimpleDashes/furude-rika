import FurudeRika from '../../../client/FurudeRika';
import DefaultContext from '../../../client/contexts/DefaultContext';
import ICommand from '../../../modules/framework/commands/interfaces/ICommand';

export default interface IFurudeCommand<CTX extends DefaultContext>
  extends ICommand<FurudeRika, CTX> {}
