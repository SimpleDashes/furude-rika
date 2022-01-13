import { SlashCommandMentionableOption } from '@discordjs/builders';
import type { CommandInteraction} from 'discord.js';
import { GuildMember, Role, User } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import type IDiscordOption from '../interfaces/IDiscordOption';

export default class MentionableOptions
  extends SlashCommandMentionableOption
  implements IDiscordOption<GuildMember | Role | User>
{
  public apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.MENTIONABLE;
  public apply(
    interaction: CommandInteraction
  ): Role | User | GuildMember | null {
    const mentionable = interaction.options.getMentionable(
      this.name,
      this.required
    );
    return mentionable instanceof Role ||
      mentionable instanceof User ||
      mentionable instanceof GuildMember
      ? mentionable
      : null;
  }
}
