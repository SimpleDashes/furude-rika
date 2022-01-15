import type ICommandContext from '../../commands/contexts/ICommandContext';
import type CommandPrecondition from '../abstracts/CommandPrecondition';

export default interface IHasPreconditions<
  CTX extends ICommandContext = ICommandContext
> {
  preconditions: CommandPrecondition<CTX>[];
}
