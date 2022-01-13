import DefaultContext from '../../../client/contexts/DefaultContext';
import ICommand from '../../../modules/framework/commands/interfaces/ICommand';

type IFurudeCommand<CTX extends DefaultContext> = ICommand<CTX>;

export default IFurudeCommand;
