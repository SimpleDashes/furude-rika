import APIRoute from '../../../../connection/apis/routes/APIRoute';
import Domains from '../../../../connection/Domains';
import BanchoUser from './objects/BanchoUser';
import IBanchoAPIUserResponse from './interfaces/users/IBanchoAPIUserResponse';
import OsuServer from '../../OsuServer';
import BanchoUsersAPI from './BanchoUsersAPI';
import IBanchoOsuParam from './params/IBanchoOsuParam';
import IBanchoOsuUserParams from './params/IBanchoOsuUserParams';
import IBanchoAPIUserRecentScore from './interfaces/scores/IBanchoAPIUserRecentScore';
import IBanchoOsuUserRecentParams from './params/IBanchoOsuUserRecentParams';
import OsuUserRecentRoute from '../../routes/OsuUserRecentRoute';
import BanchoUserRecentsAPI from './BanchoUserRecentsAPI';
import BanchoScore from './objects/BanchoScore';
import IAPIOsuBeatmap from '../../beatmaps/IAPIOsuBeatmap';
import IBanchoAPIBeatmapResponse from './interfaces/beatmaps/IBanchoAPIBeatmapResponse';
import IBanchoBeatmapParam from './params/IBanchoOsuBeatmapParam';
import OsuBeatmapsRoute from '../../routes/OsuBeatmapsRoute';
import BanchoBeatmapsAPI from './BanchoBeatmapsAPI';

export default class BanchoServer extends OsuServer<
  IBanchoOsuParam,
  BanchoUser,
  IBanchoAPIUserResponse,
  IBanchoOsuUserParams,
  BanchoScore,
  IBanchoAPIUserRecentScore,
  IBanchoOsuUserRecentParams,
  IAPIOsuBeatmap,
  IBanchoAPIBeatmapResponse,
  IBanchoBeatmapParam & IBanchoOsuParam
> {
  public name = 'bancho';

  public constructor(apiKey: string) {
    super('osu.ppy', Domains.sh, apiKey);
  }

  protected createBaseParams(): IBanchoOsuParam {
    return {
      k: this.apiKey,
    };
  }

  protected createUsersRoute(base: APIRoute<IBanchoOsuParam>): BanchoUsersAPI {
    return new BanchoUsersAPI(base, 'get_user');
  }

  protected createUsersRecentRoute(
    base: APIRoute<IBanchoOsuParam>
  ): OsuUserRecentRoute<
    BanchoScore,
    IBanchoAPIUserRecentScore,
    IBanchoOsuUserRecentParams
  > {
    return new BanchoUserRecentsAPI(base, 'get_user_recent');
  }

  protected createBeatmapsRoute(
    base: APIRoute<IBanchoOsuParam>
  ): OsuBeatmapsRoute<
    IAPIOsuBeatmap,
    IBanchoAPIBeatmapResponse,
    IBanchoBeatmapParam & IBanchoOsuParam
  > {
    return new BanchoBeatmapsAPI(base, 'get_beatmaps');
  }
}
