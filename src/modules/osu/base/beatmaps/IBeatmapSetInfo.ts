import type IBeatmapInfo from './IBeatmapInfo';
import type IBeatmapMetadataInfo from './IBeatmapMetadataInfo';

export default interface IBeatmapSetInfo {
  metadata: () => IBeatmapMetadataInfo;

  beatmaps: IBeatmapInfo[];

  maxStarDifficulty: () => number;

  maxLength: () => number;

  maxBPM: () => number;
}
