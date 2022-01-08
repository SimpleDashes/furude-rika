import APIRoute from '../../connection/apis/routes/APIRoute';
import ContentHost from '../../connection/ContentHost';
import Route from '../../connection/routes/Route';
import IOsuUser from '../users/IOsuUser';
import IBaseOsuAPIUserResponse from '../users/response/IBaseOsuAPIUserResponse';
import OsuUserRoute from './routes/OsuUserRoute';

export default abstract class OsuServer<
  BASE_PARAMS,
  U extends IOsuUser,
  U_B extends IBaseOsuAPIUserResponse,
  U_P extends BASE_PARAMS
> extends ContentHost {
  public abstract readonly name: string;
  protected apiKey: string = '';

  public api: APIRoute<BASE_PARAMS>;
  public users: OsuUserRoute<U, U_B, U_P>;

  public constructor(url: string, domain: string, apiKey?: string) {
    super(url, domain);
    if (apiKey) this.apiKey = apiKey;
    this.api = new APIRoute(this, 'api', this.createBaseParams());
    this.users = this.createUsersRoute(this.api);
  }

  public apiPath: string = 'api';

  protected abstract createBaseParams(): BASE_PARAMS;

  protected abstract createUsersRoute(base: Route): OsuUserRoute<U, U_B, U_P>;
}
