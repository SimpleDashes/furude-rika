import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import IDiscordOption from '../interfaces/IDiscordOption';

export default class StringOption
  extends SlashCommandStringOption
  implements IDiscordOption<string>
{
  public apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.STRING;
  public apply(interaction: CommandInteraction): string | null {
    return interaction.options.getString(this.name, this.required);
  }
}
