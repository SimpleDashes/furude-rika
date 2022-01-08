import BanchoUser from './objects/BanchoUser';

import IBanchoOsuUserParams from './params/IBanchoOsuUserParams';
import IBanchoAPIUserResponse from './interfaces/IBanchoAPIUserResponse';
import OsuGetRoute from '../../routes/OsuGetRoute';

export default class BanchoUsers extends OsuGetRoute<
  BanchoUser,
  IBanchoAPIUserResponse,
  IBanchoOsuUserParams
> {
  async get(
    params?: IBanchoOsuUserParams | any
  ): Promise<BanchoUser | undefined> {
    return await this.getFirstResultElseUndefined(
      (res) => new BanchoUser(res),
      params
    );
  }
}
