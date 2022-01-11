import ICommandContext from '../interfaces/ICommandContext';
import CommandPrecondition from './abstracts/CommandPrecondition';
import ICommandValidatorPrecondition from './interfaces/ICommandValidatorPrecondition';

export default class RequiresSubCommandsGroupsPrecondition
  extends CommandPrecondition
  implements ICommandValidatorPrecondition
{
  protected async validateInternally(
    context: ICommandContext<any>
  ): Promise<boolean> {
    return !!context.interaction.options.getSubcommandGroup(false);
  }
}
