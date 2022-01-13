import type { CommandInteraction } from 'discord.js';
import type { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

export default interface IDiscordOption<R> {
  readonly name: string;
  readonly required: boolean;
  readonly description: string;
  readonly apiType: ApplicationCommandOptionTypes;
  apply: (interaction: CommandInteraction) => R | null;
}
