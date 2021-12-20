import { SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import IDiscordOption from '../interfaces/IDiscordOption';

export default class StringOption
  extends SlashCommandStringOption
  implements IDiscordOption<String>
{
  apiType: ApplicationCommandOptionTypes = ApplicationCommandOptionTypes.STRING;
  apply(interaction: CommandInteraction): string | null {
    return interaction.options.getString(this.name, this.required);
  }
}
