import APIRoute from '../../connection/apis/routes/APIRoute';
import ContentHost from '../../connection/ContentHost';
import Protocol from '../../connection/Protocol';
import OsuModes from '../enums/OsuModes';
import IOsuScore from '../scores/IOsuScore';
import IOsuUser from '../users/IOsuUser';
import IBanchoAPIUserResponse from './implementations/bancho/interfaces/users/IBanchoAPIUserResponse';
import IBanchoAPIUserRecentScore from './implementations/bancho/interfaces/scores/IBanchoAPIUserRecentScore';
import OsuUserRecentRoute from './routes/OsuUserRecentRoute';
import OsuUserRoute from './routes/OsuUserRoute';
import IAPIOsuBeatmap from './beatmaps/IAPIOsuBeatmap';
import OsuBeatmapsRoute from './routes/OsuBeatmapsRoute';
import IBanchoAPIBeatmapResponse from './implementations/bancho/interfaces/beatmaps/IBanchoAPIBeatmapResponse';

export default abstract class OsuServer<
  BASE_PARAMS,
  U extends IOsuUser<any>,
  U_B extends IBanchoAPIUserResponse,
  U_P extends BASE_PARAMS,
  S extends IOsuScore,
  S_B extends IBanchoAPIUserRecentScore,
  S_P extends BASE_PARAMS,
  B extends IAPIOsuBeatmap,
  B_B extends IBanchoAPIBeatmapResponse,
  B_P extends BASE_PARAMS
> extends ContentHost {
  public abstract readonly name: string;
  protected apiKey: string = '';

  public api: APIRoute<BASE_PARAMS>;
  public users: OsuUserRoute<U, U_B, U_P>;
  public userRecents: OsuUserRecentRoute<S, S_B, S_P>;
  public beatmaps: OsuBeatmapsRoute<B, B_B, B_P>;
  public apiPath: string;

  public constructor(
    url: string,
    domain: string,
    apiKey?: string,
    apiPath?: string,
    protocol?: Protocol
  ) {
    super(url, domain, protocol);
    if (apiKey) this.apiKey = apiKey;
    this.apiPath = apiPath ?? 'api';
    this.api = new APIRoute(this, this.apiPath, this.createBaseParams());
    this.users = this.createUsersRoute(this.api);
    this.userRecents = this.createUsersRecentRoute(this.api);
    this.beatmaps = this.createBeatmapsRoute(this.api);
  }

  protected abstract createBaseParams(): BASE_PARAMS;

  protected abstract createUsersRoute(
    base: APIRoute<BASE_PARAMS>
  ): OsuUserRoute<U, U_B, U_P>;

  protected abstract createUsersRecentRoute(
    base: APIRoute<BASE_PARAMS>
  ): OsuUserRecentRoute<S, S_B, S_P>;

  protected abstract createBeatmapsRoute(
    base: APIRoute<BASE_PARAMS>
  ): OsuBeatmapsRoute<B, B_B, B_P>;

  public supportedModes(): OsuModes[] {
    return Object.values(OsuModes) as OsuModes[];
  }
}
