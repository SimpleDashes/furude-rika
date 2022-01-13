import BanchoUser from './objects/BanchoUser';

import IBanchoOsuUserParams from './params/IBanchoOsuUserParams';
import IBanchoAPIUserResponse from './interfaces/users/IBanchoAPIUserResponse';
import OsuGetRoute from '../../routes/OsuGetRoute';

export default class BanchoUsersAPI extends OsuGetRoute<
  BanchoUser,
  IBanchoAPIUserResponse,
  IBanchoOsuUserParams
> {
  public async get(
    params?: IBanchoOsuUserParams
  ): Promise<BanchoUser | undefined> {
    return await this.getFirstResultElseUndefined(
      (res) => new BanchoUser(res),
      params
    );
  }
}
