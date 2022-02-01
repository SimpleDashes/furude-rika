import type IBeatmap from '../base/beatmaps/IBeatmap';
import type DifficultyCalculator from '../base/rulesets/difficulty/DifficultyCalculator';
import type PerformanceCalculator from '../base/rulesets/difficulty/PerformanceCalculator';
import type HitObject from '../base/rulesets/objects/HitObject';
import Ruleset from '../base/rulesets/Ruleset';
import type ScoreInfo from '../base/scoring/ScoreInfo';

export default class OsuRuleset extends Ruleset {
  public createDifficultyCalculator(
    beatmap: IBeatmap<HitObject>
  ): DifficultyCalculator {
    throw new Error('Method not implemented.');
  }

  public override createPerformanceCalculator(
    beatmap: IBeatmap<HitObject>,
    score: ScoreInfo
  ): PerformanceCalculator {
    throw new Error('Method not implemented.');
  }
}
