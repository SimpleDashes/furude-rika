import APIRoute from '../../connection/apis/routes/APIRoute';
import ContentHost from '../../connection/ContentHost';
import Protocol from '../../connection/Protocol';
import Route from '../../connection/routes/Route';
import OsuModes from '../enums/OsuModes';
import IOsuUser from '../users/IOsuUser';
import IBanchoAPIUserResponse from './implementations/bancho/interfaces/IBanchoAPIUserResponse';
import OsuUserRoute from './routes/OsuUserRoute';

export default abstract class OsuServer<
  BASE_PARAMS,
  U extends IOsuUser,
  U_B extends IBanchoAPIUserResponse,
  U_P extends BASE_PARAMS
> extends ContentHost {
  public abstract readonly name: string;
  protected apiKey: string = '';

  public api: APIRoute<BASE_PARAMS>;
  public users: OsuUserRoute<U, U_B, U_P>;
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
  }

  protected abstract createBaseParams(): BASE_PARAMS;

  protected abstract createUsersRoute(base: Route): OsuUserRoute<U, U_B, U_P>;

  public supportedModes(): OsuModes[] {
    return Object.values(OsuModes) as OsuModes[];
  }
}
