import { SlashCommandBooleanOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import IDiscordOption from '../interfaces/IDiscordOption';

export default class BooleanOption
  extends SlashCommandBooleanOption
  implements IDiscordOption<boolean>
{
  public apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.BOOLEAN;
  public apply(
    interaction: CommandInteraction,
    returnDefault?: boolean
  ): boolean {
    return (
      interaction.options.getBoolean(this.name, this.required) ??
      returnDefault ??
      false
    );
  }
}
