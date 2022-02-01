import type IBeatmapDifficultyInfo from './IBeatmapDifficultyInfo';
import { DEFAULT_DIFFICULTY } from './IBeatmapDifficultyInfo';

export default class BeatmapDifficulty implements IBeatmapDifficultyInfo {
  public drainRate = DEFAULT_DIFFICULTY;
  public circleSize = DEFAULT_DIFFICULTY;
  public overallDifficulty = DEFAULT_DIFFICULTY;
  public approachRate = DEFAULT_DIFFICULTY;

  public sliderMultiplier = 1;
  public sliderTickRate = 1;

  public constructor(source?: IBeatmapDifficultyInfo) {
    if (source) {
      this.copyFrom(source);
    }
  }

  public copyTo(difficulty: BeatmapDifficulty): void {
    difficulty.approachRate = this.approachRate;
    difficulty.drainRate = this.drainRate;
    difficulty.circleSize = this.circleSize;
    difficulty.overallDifficulty = this.overallDifficulty;

    difficulty.sliderMultiplier = this.sliderMultiplier;
    difficulty.sliderTickRate = this.sliderTickRate;
  }

  public copyFrom(difficulty: IBeatmapDifficultyInfo): void {
    this.approachRate = difficulty.approachRate;
    this.drainRate = difficulty.drainRate;
    this.circleSize = difficulty.circleSize;
    this.overallDifficulty = difficulty.overallDifficulty;

    this.sliderMultiplier = difficulty.sliderMultiplier;
    this.sliderTickRate = difficulty.sliderTickRate;
  }
}
