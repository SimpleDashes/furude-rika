import type BaseEmbed from '../../embeds/BaseEmbed';
import type IHasExpandableEmbed from './IHasExpandableEmbed';

export default interface IHasExpandableDefaultEmbed
  extends IHasExpandableEmbed {
  createDefaultEmbed: (...args: unknown[]) => BaseEmbed;
}
