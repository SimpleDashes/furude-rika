import type BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import type IHasExpandableEmbed from './IHasExpandableEmbed';

export default interface IHasExpandableDefaultEmbed
  extends IHasExpandableEmbed {
  createDefaultEmbed: (...args: unknown[]) => BaseEmbed;
}
