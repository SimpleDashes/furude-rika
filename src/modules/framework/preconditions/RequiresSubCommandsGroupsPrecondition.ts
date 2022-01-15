import type ICommandContext from '../commands/contexts/ICommandContext';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class RequiresSubCommandsGroupsPrecondition extends CommandPrecondition {
  protected async validateInternally(
    context: ICommandContext
  ): Promise<boolean> {
    return !!context.interaction.options.getSubcommandGroup(false);
  }
}
