import IRunsCommand from '../interfaces/IRunsCommand';
import CommandPrecondition from './abstracts/CommandPrecondition';
import ICommandValidatorPrecondition from './interfaces/ICommandValidatorPrecondition';

export default class RequiresSubCommandsPrecondition
  extends CommandPrecondition
  implements ICommandValidatorPrecondition
{
  protected async validateInternally(
    runner: IRunsCommand<any>
  ): Promise<boolean> {
    return !!runner.interaction.options.getSubcommand(false);
  }
}
