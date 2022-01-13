import OsuBeatmapsRoute from '../../routes/OsuBeatmapsRoute';
import type IAPIOsuBeatmap from '../../beatmaps/IAPIOsuBeatmap';
import type IBanchoAPIBeatmapResponse from './interfaces/beatmaps/IBanchoAPIBeatmapResponse';
import BanchoBeatmap from './objects/BanchoBeatmap';
import type IBanchoBeatmapParam from './params/IBanchoOsuBeatmapParam';

export default class BanchoBeatmapsAPI extends OsuBeatmapsRoute<
  IAPIOsuBeatmap,
  IBanchoAPIBeatmapResponse,
  IBanchoBeatmapParam
> {
  public async get(params?: IBanchoBeatmapParam): Promise<IAPIOsuBeatmap[]> {
    return (
      (await this.getRawResponse(params)) as IBanchoAPIBeatmapResponse[]
    ).map((b) => new BanchoBeatmap(b));
  }
}
