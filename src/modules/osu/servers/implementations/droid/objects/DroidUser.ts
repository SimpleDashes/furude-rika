import type IBanchoAPIUserResponse from '../../bancho/interfaces/users/IBanchoAPIUserResponse';
import type TBanchoApiRawResponse from '../../bancho/interfaces/TBanchoApiRawResponse';
import OsuServers from '../../../OsuServers';
import type IOsuScore from '../../../../scores/IOsuScore';
import type IDroidOsuUserRecentsParams from '../params/IDroidOsuUserRecentsParams';
import BaseOsuUser from '../../../../users/BaseOsuUser';
import RequestBuilder from '../../../../../connection/apis/http/RequestBuilder';
import type IDroidOsuUserParam from '../params/IDroidOsuUserParam';

interface IDroidUserExtension {
  html?: string;
}

export default class DroidUser
  extends BaseOsuUser<IDroidOsuUserRecentsParams>
  implements IDroidUserExtension
{
  public html?: string;

  public constructor(
    raw_res: TBanchoApiRawResponse<IBanchoAPIUserResponse>,
    droid: IDroidUserExtension = {}
  ) {
    super(raw_res, OsuServers.droid);
    this.html = droid.html;
  }

  public override async fetchScores(
    params: IDroidOsuUserRecentsParams,
    fetchBeatmaps?: boolean
  ): Promise<IOsuScore[]> {
    return await this.server.userRecents.get(params, fetchBeatmaps);
  }

  public getAvatarUrl(): string {
    return '';
  }

  public getProfileUrl(): string {
    const params: IDroidOsuUserParam = {
      uid: this.user_id,
    };
    return RequestBuilder.build(OsuServers.droid.users.path, params);
  }
}
