import type IOsuUser from '../../users/IOsuUser';
import type IBanchoAPIUserResponse from '../implementations/bancho/interfaces/users/IBanchoAPIUserResponse';
import OsuGetRoute from './OsuGetRoute';

export default abstract class OsuUserRoute<
  T extends IOsuUser<never>,
  B extends IBanchoAPIUserResponse,
  P
> extends OsuGetRoute<T, B, P> {}
