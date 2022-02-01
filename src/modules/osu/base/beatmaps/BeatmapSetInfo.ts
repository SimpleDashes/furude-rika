import _ from 'lodash';
import BeatmapMetadata from './BeatmapMetadata';
import type IBeatmapInfo from './IBeatmapInfo';
import type IBeatmapMetadataInfo from './IBeatmapMetadataInfo';
import type IBeatmapSetInfo from './IBeatmapSetInfo';

export default class BeatmapSetInfo implements IBeatmapSetInfo {
  public ID!: number;

  public metadata(): IBeatmapMetadataInfo {
    return this.beatmaps[0]?.metadata ?? new BeatmapMetadata();
  }

  public readonly beatmaps: IBeatmapInfo[];

  #maxValue<T extends keyof IBeatmapInfo>(key: T): number {
    return _.max(this.beatmaps.map((b) => (b as Record<T, number>)[key])) ?? 0;
  }

  public maxStarDifficulty(): number {
    return this.#maxValue('starRating');
  }

  public maxLength(): number {
    return this.#maxValue('length');
  }

  public maxBPM(): number {
    return this.#maxValue('bpm');
  }

  public constructor(beatmaps: IBeatmapInfo[] = []) {
    this.beatmaps = beatmaps;
  }
}
