import { CommandInteraction, CacheType } from 'discord.js';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class RequiresSubCommands extends CommandPrecondition {
  protected validateInternally(
    interaction: CommandInteraction<CacheType>
  ): boolean {
    return Boolean(interaction.options.getSubcommand(false));
  }
}
