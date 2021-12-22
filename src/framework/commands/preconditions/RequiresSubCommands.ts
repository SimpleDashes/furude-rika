import { CommandInteraction, CacheType } from 'discord.js';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class extends CommandPrecondition {
  protected validateInternally(
    interaction: CommandInteraction<CacheType>
  ): boolean {
    return !!interaction.options.getSubcommand(false);
  }
}