import ICommand from '../commands/interfaces/ICommand';
import ICommandContext from '../commands/interfaces/ICommandContext';

export default interface ICommandRunResponse<
  CTX extends ICommandContext = ICommandContext
> {
  command: ICommand<ICommandContext>;
  context: CTX;
}
