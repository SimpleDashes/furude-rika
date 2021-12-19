import { SlashCommandRoleOption } from '@discordjs/builders'
import { CommandInteraction, Role } from 'discord.js'
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums'
import IDiscordOption from '../interfaces/IDiscordOption'

export default class RoleOption
  extends SlashCommandRoleOption
  implements IDiscordOption<Role>
{
  apiType: ApplicationCommandOptionTypes = ApplicationCommandOptionTypes.ROLE
  apply(interaction: CommandInteraction): Role | null {
    const role = interaction.options.getRole(this.name, this.required)
    return role instanceof Role ? role : null
  }
}
