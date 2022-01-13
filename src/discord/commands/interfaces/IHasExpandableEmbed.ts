import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';

export default interface IHasExpandableEmbed {
  createBaseEmbed(...args: unknown[]): BaseEmbed;
  createMinimizedEmbed(...args: unknown[]): BaseEmbed;
  createExpandedEmbed(...args: unknown[]): BaseEmbed;
}
