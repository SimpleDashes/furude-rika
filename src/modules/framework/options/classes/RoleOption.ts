import { SlashCommandRoleOption } from '@discordjs/builders';
import type { CommandInteraction} from 'discord.js';
import { Role } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import type IDiscordOption from '../interfaces/IDiscordOption';

export default class RoleOption
  extends SlashCommandRoleOption
  implements IDiscordOption<Role>
{
  public apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.ROLE;
  public apply(interaction: CommandInteraction): Role | null {
    const role = interaction.options.getRole(this.name, this.required);
    return role instanceof Role ? role : null;
  }
}
