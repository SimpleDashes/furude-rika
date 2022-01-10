import OsuBeatmapsRoute from '../../routes/OsuBeatmapsRoute';
import IAPIOsuBeatmap from '../../beatmaps/IAPIOsuBeatmap';
import IBanchoAPIBeatmapResponse from './interfaces/beatmaps/IBanchoAPIBeatmapResponse';
import BanchoBeatmap from './objects/BanchoBeatmap';
import IBanchoBeatmapParam from './params/IBanchoOsuBeatmapParam';

export default class BanchoBeatmapsAPI extends OsuBeatmapsRoute<
  IAPIOsuBeatmap,
  IBanchoAPIBeatmapResponse,
  IBanchoBeatmapParam
> {
  async get(params?: IBanchoBeatmapParam): Promise<IAPIOsuBeatmap[]> {
    return (
      (await this.getResponse(params)) as IBanchoAPIBeatmapResponse[]
    ).map((b) => new BanchoBeatmap(b));
  }
}
