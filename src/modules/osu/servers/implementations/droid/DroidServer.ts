import APIRoute from '../../../../connection/apis/routes/APIRoute';
import Domains from '../../../../connection/Domains';
import BanchoUser from '../bancho/objects/BanchoUser';
import IBanchoAPIUserResponse from '../bancho/interfaces/IBanchoAPIUserResponse';
import OsuServer from '../../OsuServer';
import IDroidOsuParam from './params/IDroidOsuParam';
import IDroidOsuUserParam from './params/IDroidOsuUserParam';
import DroidUsers from './DroidUsers';
import OsuModes from '../../../enums/OsuModes';
import Protocol from '../../../../connection/Protocol';

export default class DroidServer extends OsuServer<
  IDroidOsuParam,
  BanchoUser,
  IBanchoAPIUserResponse,
  IDroidOsuUserParam
> {
  public name: string = 'droid';

  public constructor() {
    super('ops.dgsrz', Domains.com, '', '', Protocol.http);
  }

  protected createBaseParams(): IDroidOsuParam {
    return {};
  }

  protected createUsersRoute(base: APIRoute<IDroidOsuParam>): DroidUsers {
    return new DroidUsers(base, 'profile.php');
  }

  public override supportedModes(): OsuModes[] {
    return [OsuModes.std];
  }
}
