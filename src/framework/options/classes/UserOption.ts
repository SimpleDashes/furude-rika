import { SlashCommandUserOption } from '@discordjs/builders'
import { CommandInteraction, User } from 'discord.js'
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums'
import IDiscordOption from '../interfaces/IDiscordOption'

export default class UserOption
  extends SlashCommandUserOption
  implements IDiscordOption<User>
{
  apiType: ApplicationCommandOptionTypes = ApplicationCommandOptionTypes.USER
  apply(interaction: CommandInteraction) {
    return interaction.options.getUser(this.name, this.required)
  }
}
