import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import IHasExpandableEmbed from './IHasExpandableEmbed';

export default interface IHasExpandableDefaultEmbed
  extends IHasExpandableEmbed {
  createDefaultEmbed(...args: any): BaseEmbed;
}
