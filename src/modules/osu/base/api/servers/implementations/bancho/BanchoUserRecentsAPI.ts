import OsuUserRecentRoute from '../../routes/OsuUserRecentRoute';
import type IOsuScore from '../../../scores/IOsuScore';
import type IBanchoAPIUserRecentScore from './interfaces/scores/IBanchoAPIUserRecentScore';
import type IBanchoOsuUserRecentParams from './params/IBanchoOsuUserRecentParams';
import BanchoScore from './objects/BanchoScore';
import OsuServers from '../../OsuServers';

export default class BanchoUserRecentsAPI extends OsuUserRecentRoute<
  IOsuScore,
  IBanchoAPIUserRecentScore,
  IBanchoOsuUserRecentParams
> {
  public async get(
    params?: IBanchoOsuUserRecentParams,
    fetchBeatmaps?: boolean
  ): Promise<IOsuScore[]> {
    const apiScores = (await this.getRawResponse(
      params
    )) as IBanchoAPIUserRecentScore[];
    const scores: IOsuScore[] = [];
    apiScores.forEach((score) =>
      scores.push(new BanchoScore(score, OsuServers.bancho))
    );
    if (fetchBeatmaps) {
      for (const score of scores) {
        await score.fetchBeatmap();
      }
    }
    return scores;
  }
}
