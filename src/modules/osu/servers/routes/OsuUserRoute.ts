import IOsuUser from '../../users/IOsuUser';
import IBaseOsuAPIUserResponse from '../../users/response/IBaseOsuAPIUserResponse';
import OsuGetRoute from './OsuGetRoute';

export default abstract class OsuUserRoute<
  T extends IOsuUser,
  B extends IBaseOsuAPIUserResponse,
  P
> extends OsuGetRoute<T, B, P> {}
