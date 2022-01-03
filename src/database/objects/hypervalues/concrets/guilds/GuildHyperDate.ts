import { CommandInteraction, CacheType } from 'discord.js';
import HyperDate from '../../HyperDate';
import GuildHyperHelper from './GuildHyperHelper';

export default class GuildHyperDate extends HyperDate {
  public getLocalDecorationKey(
    interaction: CommandInteraction<CacheType>
  ): string {
    return GuildHyperHelper.getLocalDecorationKey(interaction);
  }
}
