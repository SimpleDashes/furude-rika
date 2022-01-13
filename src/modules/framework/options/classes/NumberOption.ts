import { SlashCommandNumberOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import IDiscordOption from '../interfaces/IDiscordOption';

export default class NumberOption
  extends SlashCommandNumberOption
  implements IDiscordOption<number>
{
  public apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.NUMBER;
  public apply(interaction: CommandInteraction): number | null {
    return interaction.options.getNumber(this.name, this.required);
  }
}
