import ICommandContext from '../../interfaces/ICommandContext';
import CommandPrecondition from '../abstracts/CommandPrecondition';

export default interface IHasPreconditions<
  CTX extends ICommandContext = ICommandContext
> {
  preconditions: CommandPrecondition<CTX>[];
}
