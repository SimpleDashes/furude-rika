import type ICommand from '../commands/interfaces/ICommand';
import type ICommandContext from '../commands/interfaces/ICommandContext';

export default interface ICommandRunResponse<
  CTX extends ICommandContext = ICommandContext
> {
  command: ICommand<CTX>;
  context: CTX;
}
