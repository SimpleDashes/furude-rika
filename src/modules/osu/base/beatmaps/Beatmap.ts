import type HitObject from '../rulesets/objects/HitObject';
import BeatmapDifficulty from './BeatmapDifficulty';
import type BeatmapInfo from './BeatmapInfo';
import type BeatmapMetadata from './BeatmapMetadata';
import ControlPointInfo from './control_points/ControlPointInfo';
import type IBeatmap from './IBeatmap';
import type BreakPeriod from './timing/BreakPeriod';
import _ from 'lodash';

export default class Beatmap implements IBeatmap<HitObject> {
  public difficulty = new BeatmapDifficulty();

  public get Difficulty(): BeatmapDifficulty {
    return this.difficulty;
  }

  public set Difficulty(value: BeatmapDifficulty) {
    this.difficulty = value;
    if (this.BeatmapInfo.difficulty) {
      const clone = new BeatmapDifficulty();
      this.difficulty.copyTo(clone);
      this.BeatmapInfo.difficulty = clone;
    }
  }

  public beatmapInfo!: BeatmapInfo;

  public get BeatmapInfo(): BeatmapInfo {
    return this.beatmapInfo;
  }

  public set BeatmapInfo(value: BeatmapInfo) {
    this.beatmapInfo = value;
    this.Difficulty = this.beatmapInfo.difficulty;
  }

  public metadata(): BeatmapMetadata {
    return this.beatmapInfo.metadata;
  }

  public controlPointInfo = new ControlPointInfo();

  public breaks: BreakPeriod[] = [];

  public totalBreakTime(): number {
    return _.max(this.breaks.map((b) => b.duration)) ?? 0;
  }

  public hitObjects: HitObject[] = [];

  public getMostCommonBeatLength(): number {
    const beatLengths = this.controlPointInfo.timingPoints.map(
      (t) => t.BeatLength
    );

    const mostCommon = _.head(
      _(beatLengths).countBy().entries().maxBy(_.last)
    ) as number;

    return mostCommon;
  }

  public clone(): IBeatmap<HitObject> {
    return _.clone(this);
  }
}
