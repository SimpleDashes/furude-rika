import { Guild } from 'discord.js';
import HyperNumber from '../../HyperNumber';
import GuildHyperHelper from './GuildHyperHelper';

export default class GuildHyperNumber extends HyperNumber<Guild> {
  public getLocalDecorationKey(key: Guild): string {
    return GuildHyperHelper.getLocalDecorationKey(key);
  }
}
