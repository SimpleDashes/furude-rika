import { CommandInteraction, CacheType } from 'discord.js';
import HyperNumber from '../../HyperNumber';
import GuildHyperHelper from './GuildHyperHelper';

export default class GuildHyperNumber extends HyperNumber {
  public getLocalDecorationKey(
    interaction: CommandInteraction<CacheType>
  ): string {
    return GuildHyperHelper.getLocalDecorationKey(interaction);
  }
}
