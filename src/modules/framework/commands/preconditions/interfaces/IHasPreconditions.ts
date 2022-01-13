import type ICommandContext from '../../interfaces/ICommandContext';
import type CommandPrecondition from '../abstracts/CommandPrecondition';

export default interface IHasPreconditions<
  CTX extends ICommandContext = ICommandContext
> {
  preconditions: CommandPrecondition<CTX>[];
}
