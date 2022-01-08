import APIRoute from '../../../../connection/apis/routes/APIRoute';
import Domains from '../../../../connection/Domains';
import BanchoUser from './objects/BanchoUser';
import IBanchoAPIUserResponse from './interfaces/IBanchoAPIUserResponse';
import OsuServer from '../../OsuServer';
import BanchoUsers from './BanchoUsers';
import IBanchoOsuParam from './params/IBanchoOsuParam';
import IBanchoOsuUserParams from './params/IBanchoOsuUserParams';

export default class BanchoServer extends OsuServer<
  IBanchoOsuParam,
  BanchoUser,
  IBanchoAPIUserResponse,
  IBanchoOsuUserParams
> {
  public name: string = 'bancho';

  public constructor(apiKey: string) {
    super('osu.ppy', Domains.sh, apiKey);
  }

  protected createBaseParams(): IBanchoOsuParam {
    return {
      k: this.apiKey,
    };
  }

  protected createUsersRoute(base: APIRoute<IBanchoOsuParam>): BanchoUsers {
    return new BanchoUsers(base, 'get_user');
  }
}
