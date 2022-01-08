import OsuUserRecentRoute from '../../routes/OsuUserRecentRoute';
import IOsuScore from '../../../scores/IOsuScore';
import IBanchoAPIUserRecentScore from './interfaces/scores/IBanchoAPIUserRecentScore';
import IBanchoOsuUserRecentParams from './params/IBanchoOsuUserRecentParams';
import BanchoScore from './objects/BanchoScore';

export default class BanchoUserRecentsAPI extends OsuUserRecentRoute<
  IOsuScore,
  IBanchoAPIUserRecentScore,
  IBanchoOsuUserRecentParams
> {
  async get(
    params?: IBanchoOsuUserRecentParams | any
  ): Promise<IOsuScore[] | undefined> {
    return (
      (await this.getResponse(params)) as IBanchoAPIUserRecentScore[]
    ).map((r) => new BanchoScore(r));
  }
}
