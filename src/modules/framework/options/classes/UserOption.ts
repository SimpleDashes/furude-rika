import { SlashCommandUserOption } from '@discordjs/builders';
import type { CommandInteraction, User } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import type IDiscordOption from '../interfaces/IDiscordOption';

export default class UserOption
  extends SlashCommandUserOption
  implements IDiscordOption<User>
{
  public readonly defaultToSelf: boolean;
  public constructor(defaultToSelf = false) {
    super();
    this.defaultToSelf = defaultToSelf;
  }
  public apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.USER;
  public apply(interaction: CommandInteraction): User | null {
    const user = interaction.options.getUser(this.name, this.required);
    return user ? user : this.defaultToSelf ? interaction.user : null;
  }
}
