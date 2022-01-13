import type APIRoute from '../../../../connection/apis/routes/APIRoute';
import Domains from '../../../../connection/Domains';
import type BanchoUser from './objects/BanchoUser';
import type IBanchoAPIUserResponse from './interfaces/users/IBanchoAPIUserResponse';
import OsuServer from '../../OsuServer';
import BanchoUsersAPI from './BanchoUsersAPI';
import type IBanchoOsuParam from './params/IBanchoOsuParam';
import type IBanchoOsuUserParams from './params/IBanchoOsuUserParams';
import type IBanchoAPIUserRecentScore from './interfaces/scores/IBanchoAPIUserRecentScore';
import type IBanchoOsuUserRecentParams from './params/IBanchoOsuUserRecentParams';
import type OsuUserRecentRoute from '../../routes/OsuUserRecentRoute';
import BanchoUserRecentsAPI from './BanchoUserRecentsAPI';
import type BanchoScore from './objects/BanchoScore';
import type IAPIOsuBeatmap from '../../beatmaps/IAPIOsuBeatmap';
import type IBanchoAPIBeatmapResponse from './interfaces/beatmaps/IBanchoAPIBeatmapResponse';
import type IBanchoBeatmapParam from './params/IBanchoOsuBeatmapParam';
import type OsuBeatmapsRoute from '../../routes/OsuBeatmapsRoute';
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
