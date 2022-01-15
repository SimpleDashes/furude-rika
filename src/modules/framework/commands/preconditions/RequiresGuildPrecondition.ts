import type ICommandContext from '../contexts/ICommandContext';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class RequiresGuildPrecondition extends CommandPrecondition {
  protected async validateInternally(
    context: ICommandContext
  ): Promise<boolean> {
    return context.interaction.inGuild();
  }
}
