import ICommand from '../commands/interfaces/ICommand';
import ICommandContext from '../commands/interfaces/ICommandContext';
import BaseBot from './BaseBot';

export default interface ICommandRunResponse<
  CTX extends ICommandContext<BaseBot>
> {
  command: ICommand<BaseBot, CTX>;
  context: CTX;
}
