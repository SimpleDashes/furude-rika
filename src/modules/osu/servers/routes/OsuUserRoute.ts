import IOsuUser from '../../users/IOsuUser';
import IBanchoAPIUserResponse from '../implementations/bancho/interfaces/users/IBanchoAPIUserResponse';
import OsuGetRoute from './OsuGetRoute';

export default abstract class OsuUserRoute<
  T extends IOsuUser<any>,
  B extends IBanchoAPIUserResponse,
  P
> extends OsuGetRoute<T, B, P> {}
