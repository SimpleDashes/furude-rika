import Protocol from '../../../../../connection/Protocol';
import IOsuScore from '../../../../scores/IOsuScore';
import BaseOsuUser from '../../../../users/BaseOsuUser';
import OsuServers from '../../../OsuServers';
import TBanchoApiRawResponse from '../interfaces/TBanchoApiRawResponse';
import IBanchoAPIUserResponse from '../interfaces/users/IBanchoAPIUserResponse';
import IBanchoOsuUserRecentParams from '../params/IBanchoOsuUserRecentParams';

export default class BanchoUser extends BaseOsuUser<IBanchoOsuUserRecentParams> {
  public constructor(res: TBanchoApiRawResponse<IBanchoAPIUserResponse>) {
    super(res, OsuServers.bancho);
  }

  public async fetchScores(
    params: IBanchoOsuUserRecentParams,
    fetchBeatmaps?: boolean
  ): Promise<IOsuScore[]> {
    return await this.server.userRecents.get(params, fetchBeatmaps);
  }

  public getAvatarUrl(): string {
    return `${Protocol.https}://a.ppy.sh/${this.user_id}?.jpg`;
  }

  public getProfileUrl(): string {
    return `${OsuServers.bancho.Url}/users/${this.user_id}`;
  }
}
