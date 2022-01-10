import IRunsCommand from '../interfaces/IRunsCommand';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class RequiresGuildPrecondition extends CommandPrecondition {
  protected async validateInternally(
    runner: IRunsCommand<any>
  ): Promise<boolean> {
    return runner.interaction.inGuild();
  }
}
