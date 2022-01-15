import type DefaultContext from '../../../client/contexts/DefaultContext';
import type { TypedArgs } from '../../../modules/framework/commands/contexts/types';
import type ICommand from '../../../modules/framework/commands/interfaces/ICommand';

type IFurudeCommand<CTX extends DefaultContext<TypedArgs<A>>, A> = ICommand<
  CTX,
  A
>;

export default IFurudeCommand;
