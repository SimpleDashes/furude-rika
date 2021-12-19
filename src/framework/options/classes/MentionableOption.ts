import { SlashCommandMentionableOption } from '@discordjs/builders'
import { CommandInteraction, GuildMember, Role, User } from 'discord.js'
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums'
import IDiscordOption from '../interfaces/IDiscordOption'

export default class MentionableOptions
  extends SlashCommandMentionableOption
  implements IDiscordOption<GuildMember | Role | User>
{
  apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.MENTIONABLE
  apply(interaction: CommandInteraction): Role | User | GuildMember | null {
    const mentionable = interaction.options.getMentionable(
      this.name,
      this.required
    )
    return mentionable instanceof Role ||
      mentionable instanceof User ||
      mentionable instanceof GuildMember
      ? mentionable
      : null
  }
}
