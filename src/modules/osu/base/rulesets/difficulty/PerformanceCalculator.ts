import type IBeatmap from '../../beatmaps/IBeatmap';
import type { Mod } from '../../mods/Mod';
import type ScoreInfo from '../../scoring/ScoreInfo';
import type IRulesetInfo from '../IRulesetInfo';
import type PerformanceAttributes from './PerformanceAttributes';
import ClockRateProcessor from './utils/ClockRateProcessor';

export default abstract class PerformanceCalculator {
  protected readonly ruleset: IRulesetInfo;
  protected readonly beatmap: IBeatmap;
  protected readonly score: ScoreInfo;

  protected timeRate = 1;

  public constructor(
    ruleset: IRulesetInfo,
    beatmap: IBeatmap,
    score: ScoreInfo
  ) {
    this.ruleset = ruleset;
    this.beatmap = beatmap;
    this.score = score;
    this.applyMods(score.mods);
  }

  protected applyMods(mods: Mod[]): void {
    this.timeRate = ClockRateProcessor.processClockRate(mods);
  }

  public abstract calculate(): PerformanceAttributes;
}
