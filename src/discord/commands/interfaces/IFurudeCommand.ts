import type DefaultContext from '../../../client/contexts/DefaultContext';
import type ICommand from '../../../modules/framework/commands/interfaces/ICommand';

type IFurudeCommand<CTX extends DefaultContext> = ICommand<CTX>;

export default IFurudeCommand;
