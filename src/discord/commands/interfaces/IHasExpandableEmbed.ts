import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';

export default interface IHasExpandableEmbed {
  createBaseEmbed(...args: any): BaseEmbed;
  createMinimizedEmbed(...args: any): BaseEmbed;
  createExpandedEmbed(...args: any): BaseEmbed;
}
