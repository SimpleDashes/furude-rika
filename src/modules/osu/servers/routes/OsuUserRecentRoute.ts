import IOsuScore from '../../scores/IOsuScore';
import IBanchoAPIUserRecentScore from '../implementations/bancho/interfaces/scores/IBanchoAPIUserRecentScore';
import OsuGetRoute from './OsuGetRoute';

export default abstract class OsuUserRecentRoute<
  T extends IOsuScore,
  B extends IBanchoAPIUserRecentScore,
  P
> extends OsuGetRoute<T[], B, P> {}
