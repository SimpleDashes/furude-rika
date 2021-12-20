import { SlashCommandNumberOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import IDiscordOption from '../interfaces/IDiscordOption';

export default class NumberOption
  extends SlashCommandNumberOption
  implements IDiscordOption<Number>
{
  apiType: ApplicationCommandOptionTypes = ApplicationCommandOptionTypes.NUMBER;
  apply(interaction: CommandInteraction): Number | null {
    return interaction.options.getNumber(this.name, this.required);
  }
}
