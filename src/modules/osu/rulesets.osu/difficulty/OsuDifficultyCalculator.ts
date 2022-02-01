import type IBeatmap from '../../base/beatmaps/IBeatmap';
import type { Mod } from '../../base/mods/Mod';
import type DifficultyAttributes from '../../base/rulesets/difficulty/DifficultyAttributes';
import DifficultyCalculator from '../../base/rulesets/difficulty/DifficultyCalculator';
import type DIfficultyHitObject from '../../base/rulesets/difficulty/preprocessing/DIfficultyHitObject';
import DifficultyHitObject from '../../base/rulesets/difficulty/preprocessing/DIfficultyHitObject';
import type Skill from '../../base/rulesets/difficulty/skills/Skill';
import type HitObject from '../../base/rulesets/objects/HitObject';
import OsuDifficultyHitObject from '../preprocessing/OsuDifficultyHitObject';

export default class OsuDifficultyCalculator extends DifficultyCalculator {
  protected createDifficultyHitObjects(
    beatmap: IBeatmap<HitObject>,
    clockRate: number
  ): DIfficultyHitObject[] {
    const difficultyHitObjects: HitObject[] = [];
    for (let i = 0; i < beatmap.hitObjects.length; i++) {
      const lastLast = beatmap.hitObjects[i - 2];
      const last = beatmap.hitObjects[i - 1];
      const current = beatmap.hitObjects[i];
      difficultyHitObjects.push(new OsuDifficultyHitObject(current, lastLast)));
    }
  }
  protected createSkills(
    beatmap: IBeatmap<HitObject>,
    mods: Mod[],
    clockRate: number
  ): Skill[] {
    throw new Error('Method not implemented.');
  }
  protected createDifficultyAttributes(
    beatmap: IBeatmap<HitObject>,
    mods: Mod[],
    skills: Skill[],
    clockRate: number
  ): DifficultyAttributes {
    throw new Error('Method not implemented.');
  }
}
