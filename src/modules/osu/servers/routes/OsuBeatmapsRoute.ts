import IAPIOsuBeatmap from '../beatmaps/IAPIOsuBeatmap';
import IBanchoAPIBeatmapResponse from '../implementations/bancho/interfaces/beatmaps/IBanchoAPIBeatmapResponse';
import OsuGetRoute from './OsuGetRoute';

export default abstract class OsuBeatmapsRoute<
  T extends IAPIOsuBeatmap,
  B extends IBanchoAPIBeatmapResponse,
  P
> extends OsuGetRoute<T[], B, P> {
  abstract override get(params?: P | Partial<P>): Promise<T[]>;
}
