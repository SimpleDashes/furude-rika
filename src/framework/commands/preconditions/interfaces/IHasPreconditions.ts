import CommandPrecondition from '../abstracts/CommandPrecondition';

export default interface IHasPreconditions {
  preconditions: CommandPrecondition[];
  requiresSubCommands: boolean;
}
