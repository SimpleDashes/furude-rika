import _ from 'lodash';
import type IBeatmap from '../../beatmaps/IBeatmap';
import type { Mod } from '../../mods/Mod';
import type DifficultyAttributes from './DifficultyAttributes';
import type DifficultyHitObject from './preprocessing/DIfficultyHitObject';
import type Skill from './skills/Skill';
import ClockRateProcessor from './utils/ClockRateProcessor';

export default abstract class DifficultyCalculator {
  private beatmap: IBeatmap;

  protected get Beatmap(): IBeatmap {
    return this.beatmap;
  }

  private playableMods: Mod[] = [];
  private clockRate = 1;

  public constructor(beatmap: IBeatmap) {
    this.beatmap = beatmap;
  }

  private createSelfBasedDifficultyAttributes(
    skills: Skill[]
  ): DifficultyAttributes {
    return this.createDifficultyAttributes(
      this.beatmap,
      this.playableMods,
      skills,
      this.clockRate
    );
  }

  public calculate(mods: Mod[] = []): DifficultyAttributes {
    this.preprocess(mods);

    const skills = this.createSkills(
      this.beatmap,
      this.playableMods,
      this.clockRate
    );

    const createAttributes = (): DifficultyAttributes =>
      this.createSelfBasedDifficultyAttributes(skills);

    if (this.beatmap.hitObjects.length === 0) return createAttributes();

    this.getDifficultyHitObjects().forEach((hitObject) => {
      skills.forEach((skill) => {
        skill.processInternal(hitObject);
      });
    });

    return createAttributes();
  }

  private getDifficultyHitObjects(): DifficultyHitObject[] {
    return this.sortObjects(
      this.createDifficultyHitObjects(this.Beatmap, this.clockRate)
    );
  }

  protected sortObjects(input: DifficultyHitObject[]): DifficultyHitObject[] {
    return _.sortBy(input, (o) => o.startTime);
  }

  protected abstract createDifficultyHitObjects(
    beatmap: IBeatmap,
    clockRate: number
  ): DifficultyHitObject[];

  protected abstract createSkills(
    beatmap: IBeatmap,
    mods: Mod[],
    clockRate: number
  ): Skill[];

  protected abstract createDifficultyAttributes(
    beatmap: IBeatmap,
    mods: Mod[],
    skills: Skill[],
    clockRate: number
  ): DifficultyAttributes;

  private preprocess(mods: Mod[]): void {
    const playableMods = mods;
    this.clockRate = ClockRateProcessor.processClockRate(playableMods);
  }

  public createDifficultyAdjustmentMods(): Mod[] {
    return this.playableMods;
  }

  protected difficultyAdjustmentMods: Mod[] = [];
}
