import APIRoute from '../../../../connection/apis/routes/APIRoute';
import Domains from '../../../../connection/Domains';
import IBanchoAPIUserResponse from '../bancho/interfaces/users/IBanchoAPIUserResponse';
import OsuServer from '../../OsuServer';
import IDroidOsuParam from './params/IDroidOsuParam';
import IDroidOsuUserParam from './params/IDroidOsuUserParam';
import DroidUsersAPI from './DroidUsersAPI';
import OsuModes from '../../../enums/OsuModes';
import Protocol from '../../../../connection/Protocol';
import DroidScore from './objects/DroidScore';
import IBanchoAPIUserRecentScore from '../bancho/interfaces/scores/IBanchoAPIUserRecentScore';
import DroidUser from './objects/DroidUser';
import DroidUserRecentsAPI from './DroidUserRecentsAPI';
import IDroidOsuUserRecentsParam from './params/IDroidOsuUserRecentsParams';
import OsuBeatmapsRoute from '../../routes/OsuBeatmapsRoute';

export default class DroidServer extends OsuServer<
  IDroidOsuParam,
  DroidUser,
  IBanchoAPIUserResponse,
  IDroidOsuUserParam,
  DroidScore,
  IBanchoAPIUserRecentScore,
  IDroidOsuUserRecentsParam,
  any,
  any,
  any
> {
  public name: string = 'droid';

  public constructor() {
    super('ops.dgsrz', Domains.com, '', '', Protocol.http);
  }

  protected createBaseParams(): IDroidOsuParam {
    return {};
  }

  protected createUsersRoute(base: APIRoute<IDroidOsuParam>): DroidUsersAPI {
    return new DroidUsersAPI(base, 'profile.php');
  }

  protected createBeatmapsRoute(
    _base: APIRoute<IDroidOsuParam>
  ): OsuBeatmapsRoute<any, any, any> {
    return undefined as unknown as OsuBeatmapsRoute<any, any, any>;
  }

  protected createUsersRecentRoute(
    base: APIRoute<IDroidOsuParam>
  ): DroidUserRecentsAPI {
    return new DroidUserRecentsAPI(base, '');
  }

  public override supportedModes(): OsuModes[] {
    return [OsuModes.std];
  }
}
