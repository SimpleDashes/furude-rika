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
    params?: IBanchoOsuUserRecentParams | any,
    fetchBeatmaps?: boolean
  ): Promise<IOsuScore[]> {
    const apiScores = (await this.getResponse(
      params
    )) as IBanchoAPIUserRecentScore[];
    const scores: IOsuScore[] = [];
    for (const apiScore of apiScores) {
      scores.push(new BanchoScore(apiScore));
    }
    if (fetchBeatmaps) {
      for await (const score of scores) {
        await score.fetchBeatmap();
      }
    }
    return scores;
  }
}