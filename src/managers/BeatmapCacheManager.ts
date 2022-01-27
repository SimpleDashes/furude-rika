import { assertDefined } from 'discowork';
import type IOsuScore from '../modules/osu/scores/IOsuScore';
import type IAPIOsuBeatmap from '../modules/osu/servers/beatmaps/IAPIOsuBeatmap';
import DroidScore from '../modules/osu/servers/implementations/droid/objects/DroidScore';
import OsuServers from '../modules/osu/servers/OsuServers';
import BaseFurudeManager from './abstracts/BaseFurudeManager';

export default class BeatmapCacheManager extends BaseFurudeManager {
  public name(): string {
    return 'BEATMAP';
  }

  public async fetchBeatmap(
    beatmapIDOrHash: string,
    fetchBeatmaps = async (): Promise<IAPIOsuBeatmap[]> => {
      return await OsuServers.bancho.beatmaps.get({
        b: parseInt(beatmapIDOrHash),
      });
    }
  ): Promise<IAPIOsuBeatmap | undefined> {
    let selectedBeatmap: IAPIOsuBeatmap | undefined;

    const cacheBeatmap: IAPIOsuBeatmap | undefined = (selectedBeatmap =
      this.rika.db.baseCache.get(beatmapIDOrHash));

    /**
     * We also don't want to load cache from maps that we previously couldn't fetch.
     */
    if (!cacheBeatmap && cacheBeatmap !== null) {
      const beatmaps = await fetchBeatmaps();
      const newBeatmap = beatmaps[0];
      this.rika.db.baseCache.set(beatmapIDOrHash, newBeatmap ?? null, 60);
      selectedBeatmap = newBeatmap;
    }

    return selectedBeatmap;
  }

  public async fetchFromScore(
    score: IOsuScore
  ): Promise<IAPIOsuBeatmap | undefined> {
    const beatmap = await this.fetchBeatmap(
      score instanceof DroidScore
        ? ((): string => {
            assertDefined(score.beatmapHash);
            return score.beatmapHash;
          })()
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
