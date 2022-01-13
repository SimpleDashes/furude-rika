import type BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';

export default interface IHasExpandableEmbed {
  createBaseEmbed: (...args: never[]) => BaseEmbed;
  createMinimizedEmbed: (...args: never[]) => BaseEmbed;
  createExpandedEmbed: (...args: never[]) => BaseEmbed;
}
