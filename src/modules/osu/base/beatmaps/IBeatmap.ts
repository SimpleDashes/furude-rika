import type HitObject from '../rulesets/objects/HitObject';
import type BeatmapDifficulty from './BeatmapDifficulty';
import type BeatmapMetadata from './BeatmapMetadata';
import type ControlPointInfo from './control_points/ControlPointInfo';
import type IBeatmapInfo from './IBeatmapInfo';
import type BreakPeriod from './timing/BreakPeriod';

export default interface IBeatmap<T extends HitObject = HitObject> {
  beatmapInfo: IBeatmapInfo;

  metadata: () => BeatmapMetadata;

  difficulty: BeatmapDifficulty;

  controlPointInfo: ControlPointInfo;

  breaks: BreakPeriod[];

  totalBreakTime: () => number;

  hitObjects: T[];

  getMostCommonBeatLength: () => number;

  clone: () => IBeatmap<T>;
}
