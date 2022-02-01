import type { Mod } from '../../../mods/Mod';
import type DifficultyHitObject from '../preprocessing/DIfficultyHitObject';

export default abstract class Skill {
  protected previous: DifficultyHitObject[];

  protected historyLength = 1;

  protected readonly mods: Mod[];

  public constructor(mods: Mod[] = []) {
    this.mods = mods;
    this.previous = new Array(this.historyLength + 1);
  }

  public processInternal(current: DifficultyHitObject): void {
    while (this.previous.length > this.historyLength) {
      this.previous.shift();
    }

    this.process(current);

    this.previous.push(current);
  }

  protected abstract process(current: DifficultyHitObject): void;
}
