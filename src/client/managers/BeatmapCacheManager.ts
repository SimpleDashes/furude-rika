import { hoursToSeconds } from 'date-fns';
import IOsuScore from '../../modules/osu/scores/IOsuScore';
import IAPIOsuBeatmap from '../../modules/osu/servers/beatmaps/IAPIOsuBeatmap';
import DroidScore from '../../modules/osu/servers/implementations/droid/objects/DroidScore';
import OsuServers from '../../modules/osu/servers/OsuServers';
import BaseFurudeCacheManager from './abstracts/BaseFurudeCacheManager';

export default class BeatmapCacheManager extends BaseFurudeCacheManager<
  string,
  IAPIOsuBeatmap
> {
  public name(): string {
    return 'BEATMAP';
  }

  public cacheLimit(): number {
    return 1000;
  }

  public cacheDuration(): number {
    return hoursToSeconds(24);
  }

  public async fetchBeatmap(
    beatmapIDOrHash: string,
    fetchBeatmaps: () => Promise<IAPIOsuBeatmap[]> = async () => {
      return await OsuServers.bancho.beatmaps.get({
        b: parseInt(beatmapIDOrHash),
      });
    }
  ): Promise<IAPIOsuBeatmap | undefined> {
    let beatmap: IAPIOsuBeatmap | undefined;

    const key = this.collection.findKey(
      (v) =>
        v.md5 === beatmapIDOrHash || v.beatmapID.toString() === beatmapIDOrHash
    );

    if (key && this.collection.has(key)) {
      beatmap = this.collection.get(key);
    } else {
      const beatmaps = await fetchBeatmaps();
      beatmap = beatmaps[0];
      if (beatmap) {
        this.collection.set(beatmapIDOrHash, beatmap);
      }
    }

    return beatmap;
  }

  public async fetchFromScore(score: IOsuScore) {
    const beatmap = await this.fetchBeatmap(
      score instanceof DroidScore
        ? score.beatmapHash!
        : score.beatmapID.toString(),
      async () => {
        const beatmap = await score.fetchBeatmap();
        return beatmap ? [beatmap] : [];
      }
    );
    score.apiBeatmap = beatmap;
    return beatmap;
  }
}
