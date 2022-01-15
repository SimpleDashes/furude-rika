import type ICommand from '../commands/interfaces/ICommand';
import type ICommandContext from '../commands/contexts/ICommandContext';
import type { TypedArgs } from '../commands/contexts/types';

export default interface ICommandRunResponse<
  CTX extends ICommandContext<TypedArgs<unknown>> = ICommandContext<
    TypedArgs<unknown>
  >
> {
  command: ICommand<CTX, unknown>;
  context: CTX;
}
