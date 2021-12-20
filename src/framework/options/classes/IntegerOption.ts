import { SlashCommandIntegerOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import IDiscordOption from '../interfaces/IDiscordOption';

export default class IntegerOption
  extends SlashCommandIntegerOption
  implements IDiscordOption<Number>
{
  apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.INTEGER;
  apply(interaction: CommandInteraction): Number | null {
    return interaction.options.getInteger(this.name, this.required);
  }
}
