import type IBeatmapDifficultyInfo from './IBeatmapDifficultyInfo';
import type IBeatmapMetadataInfo from './IBeatmapMetadataInfo';
import type IBeatmapSetInfo from './IBeatmapSetInfo';

export default interface IBeatmapInfo {
  difficultyName: string;

  metadata: IBeatmapMetadataInfo;

  difficulty: IBeatmapDifficultyInfo;

  beatmapSet?: IBeatmapSetInfo;

  length: number;

  bpm: number;

  hash: string;

  md5: string;

  starRating: number;
}
