import type ICommandContext from '../contexts/ICommandContext';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class RequiresSubCommandsPrecondition extends CommandPrecondition {
  protected async validateInternally(
    context: ICommandContext
  ): Promise<boolean> {
    return !!context.interaction.options.getSubcommand(false);
  }
}
