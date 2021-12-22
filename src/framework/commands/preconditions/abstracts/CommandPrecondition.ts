import { CommandInteraction } from 'discord.js';

export default abstract class CommandPrecondition {
  public validate(interaction: CommandInteraction) {
    return this.validateInternally(interaction);
  }
  protected abstract validateInternally(
    interaction: CommandInteraction
  ): boolean;
}
