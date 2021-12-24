import { CommandInteraction, CacheType } from 'discord.js';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class RequiresSubGroups extends CommandPrecondition {
  protected validateInternally(
    interaction: CommandInteraction<CacheType>
  ): boolean {
    return !!interaction.options.getSubcommandGroup(false);
  }
}
