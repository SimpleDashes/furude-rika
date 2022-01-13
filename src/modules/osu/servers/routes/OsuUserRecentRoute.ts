import type IOsuScore from '../../scores/IOsuScore';
import type IBanchoAPIUserRecentScore from '../implementations/bancho/interfaces/scores/IBanchoAPIUserRecentScore';
import OsuGetRoute from './OsuGetRoute';

export default abstract class OsuUserRecentRoute<
  T extends IOsuScore,
  B extends IBanchoAPIUserRecentScore,
  P
> extends OsuGetRoute<T[], B, P> {
  public abstract override get(
    params?: P | Partial<P>,
    fetchBeatmaps?: boolean
  ): Promise<T[]>;
}
