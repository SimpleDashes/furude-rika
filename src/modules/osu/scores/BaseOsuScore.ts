import IAPIOsuBeatmap from '../servers/beatmaps/IAPIOsuBeatmap';
import IBaseBanchoAPIScore from '../servers/implementations/bancho/interfaces/scores/IBaseBanchoAPIScore';
import OsuServers, { AnyServer } from '../servers/OsuServers';
import IOsuScoreCounts from './interfaces/IOsuScoreCounts';
import IOsuScore from './IOsuScore';

export default class BaseOsuScore implements IOsuScore {
  public readonly beatmapID: number;
  public readonly score: number;
  public readonly counts: IOsuScoreCounts;
  public readonly perfect: boolean;
  public readonly mods: string;
  public readonly userID: string;
  public readonly date: Date;
  public readonly rank: string;
  public server: AnyServer;
  public apiBeatmap?: IAPIOsuBeatmap | undefined;

  public constructor(base: IBaseBanchoAPIScore, server: AnyServer) {
    this.server = server;
    this.beatmapID = parseInt(base.beatmap_id);
    this.score = parseInt(base.score);
    this.counts = {
      300: parseInt(base.count300),
      100: parseInt(base.count100),
      50: parseInt(base.count50),
      misses: parseInt(base.countmiss),
      katu: parseInt(base.countkatu),
      geki: parseInt(base.countgeki),
      combo: parseInt(base.maxcombo),
    };
    this.perfect = !!base.perfect;
    this.mods = base.enabled_mods;
    this.userID = base.user_id;
    this.date = new Date(base.date);
    this.rank = base.rank;
  }

  public async fetchBeatmap(): Promise<IAPIOsuBeatmap | undefined> {
    const beatmap =
      (
        await OsuServers.bancho.beatmaps.get({
          b: this.beatmapID,
        })
      )[0] ?? undefined;
    this.apiBeatmap = beatmap;
    return beatmap;
  }
}
