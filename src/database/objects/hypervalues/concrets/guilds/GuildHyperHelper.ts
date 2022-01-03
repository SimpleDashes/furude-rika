import { CacheType, CommandInteraction, Snowflake } from 'discord.js';

export default class GuildHyperHelper {
  public static getLocalDecorationKey(
    interaction: CommandInteraction<CacheType>
  ): Snowflake {
    return interaction.guildId!;
  }
}
