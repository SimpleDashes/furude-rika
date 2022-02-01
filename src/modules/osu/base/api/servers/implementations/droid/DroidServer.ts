import type APIRoute from '../../../../../../connection/apis/routes/APIRoute';
import Domains from '../../../../../../connection/Domains';
import type IBanchoAPIUserResponse from '../bancho/interfaces/users/IBanchoAPIUserResponse';
import OsuServer from '../../OsuServer';
import type IDroidOsuParam from './params/IDroidOsuParam';
import type IDroidOsuUserParam from './params/IDroidOsuUserParam';
import DroidUsersAPI from './DroidUsersAPI';
import Protocol from '../../../../../../connection/Protocol';
import type DroidScore from './objects/DroidScore';
import type IBanchoAPIUserRecentScore from '../bancho/interfaces/scores/IBanchoAPIUserRecentScore';
import type DroidUser from './objects/DroidUser';
import DroidUserRecentsAPI from './DroidUserRecentsAPI';
import type IDroidOsuUserRecentsParam from './params/IDroidOsuUserRecentsParams';
import type OsuBeatmapsRoute from '../../routes/OsuBeatmapsRoute';
import OsuModes from '../../../enums/OsuModes';

export default class DroidServer extends OsuServer<
  IDroidOsuParam,
  DroidUser,
  IBanchoAPIUserResponse,
  IDroidOsuUserParam,
  DroidScore,
  IBanchoAPIUserRecentScore,
  IDroidOsuUserRecentsParam,
  never,
  never,
  never
> {
  public name = 'droid';

  public constructor() {
    super('ops.dgsrz', Domains.com, '', '', Protocol.http);
  }

  protected createBaseParams(): IDroidOsuParam {
    return {};
  }

  protected createUsersRoute(base: APIRoute<IDroidOsuParam>): DroidUsersAPI {
    return new DroidUsersAPI(base, 'profile.php');
  }

  protected createBeatmapsRoute(): OsuBeatmapsRoute<never, never, never> {
    return undefined as unknown as OsuBeatmapsRoute<never, never, never>;
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
