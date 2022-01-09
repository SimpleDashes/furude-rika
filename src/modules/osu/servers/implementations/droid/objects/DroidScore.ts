import IAPIOsuBeatmap from '../../../beatmaps/IAPIOsuBeatmap';

import OsuServers from '../../../OsuServers';
import IBaseBanchoAPIScore from '../../bancho/interfaces/scores/IBaseBanchoAPIScore';
import BanchoScore from '../../bancho/objects/BanchoScore';

interface IDroidScoreExtension {
  beatmapHash?: string;
}
export default class DroidScore
  extends BanchoScore
  implements IDroidScoreExtension
{
  public beatmapHash?: string;

  public constructor(
    base: IBaseBanchoAPIScore,
    extension?: IDroidScoreExtension
  ) {
    super(base);
    if (extension) {
      if (extension.beatmapHash) {
        this.beatmapHash = extension.beatmapHash;
      }
    }
  }

  override async fetchBeatmap(): Promise<IAPIOsuBeatmap | undefined> {
    let newBeatmap: IAPIOsuBeatmap | undefined;
    if (this.beatmapHash) {
      newBeatmap = (
        await OsuServers.bancho.beatmaps.get({
          h: this.beatmapHash,
        })
      )[0];
    }
    if (newBeatmap) {
      this.apiBeatmap = newBeatmap;
    }
    return this.apiBeatmap;
  }
}
