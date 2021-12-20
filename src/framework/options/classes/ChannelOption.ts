import { SlashCommandChannelOption } from '@discordjs/builders';
import { GuildChannel, ThreadChannel, CommandInteraction } from 'discord.js';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

import IDiscordOption from '../interfaces/IDiscordOption';

export default class ChannelOption
  extends SlashCommandChannelOption
  implements IDiscordOption<GuildChannel | ThreadChannel>
{
  apiType: ApplicationCommandOptionTypes =
    ApplicationCommandOptionTypes.CHANNEL;
  apply(interaction: CommandInteraction): GuildChannel | ThreadChannel | null {
    const channel = interaction.options.getChannel(this.name, this.required);
    return channel instanceof GuildChannel || channel instanceof ThreadChannel
      ? channel
      : null;
  }
}
