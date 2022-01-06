import BanchoUser from '../../users/BanchoUser';
import IBaseOsuAPIUserResponse from '../../users/response/IBaseOsuAPIUserResponse';
import OsuUserRoute from '../routes/OsuUserRoute';
import IBaseBanchoOsuUserParam from './params/base/IBaseBanchoOsuUserParam';
import IBanchoOsuUserParams from './params/IBanchoOsuUserParams';

export default class BanchoUsers extends OsuUserRoute<
  BanchoUser,
  IBaseOsuAPIUserResponse,
  IBanchoOsuUserParams
> {
  async get(
    params?: IBaseBanchoOsuUserParam | any
  ): Promise<BanchoUser | undefined> {
    return await this.getFirstResultElseUndefined(
      (res) => new BanchoUser(res),
      params
    );
  }
}
