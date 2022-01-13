import type { Guild } from 'discord.js';
import HyperDate from '../../HyperDate';
import GuildHyperHelper from './GuildHyperHelper';

export default class GuildHyperDate extends HyperDate<Guild> {
  public getLocalDecorationKey(key: Guild): string {
    return GuildHyperHelper.getLocalDecorationKey(key);
  }
}
