import type { CommandInteraction } from 'discord.js';
import CommandOptions from '../../../../containers/CommandOptions';
import IntegerOption from '../classes/IntegerOption';
import { clamp } from '@stdlib/math/base/special';

export default class PageOption extends IntegerOption {
  public readonly itemsPerPage: number;

  public constructor(itemsPerPage: number) {
    super();
    this.itemsPerPage = itemsPerPage;
    this.setName(CommandOptions.page);
  }

  public override apply<T>(interaction: CommandInteraction, res?: T[]): number {
    if (!res) {
      throw 'PageOption apply: res argument shall be passed.';
    }

    return clamp(
      super.apply(interaction) ?? 1,
      1,
      Math.ceil(res.length / this.itemsPerPage)
    );
  }
}
