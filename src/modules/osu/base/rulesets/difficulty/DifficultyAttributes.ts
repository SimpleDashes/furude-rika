import type { Mod } from '../../mods/Mod';

export default class DifficultyAttributes {
  public mods: Mod[];

  public starRating: number;

  public maxCombo = 0;

  public constructor(mods: Mod[] = [], starRating = 0) {
    this.mods = mods;
    this.starRating = starRating;
  }
}
