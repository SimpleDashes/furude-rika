import type BaseEmbed from '../../embeds/BaseEmbed';

export default interface IHasExpandableEmbed {
  createBaseEmbed: (...args: never[]) => BaseEmbed;
  createMinimizedEmbed: (...args: never[]) => BaseEmbed;
  createExpandedEmbed: (...args: never[]) => BaseEmbed;
}
