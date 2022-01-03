import { Guild, Snowflake } from 'discord.js';

export default class GuildHyperHelper {
  public static getLocalDecorationKey(key: Guild): Snowflake {
    return key.id;
  }
}
