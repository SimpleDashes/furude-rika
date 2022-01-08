import IOsuUser from '../../users/IOsuUser';
import IBanchoAPIUserResponse from '../implementations/bancho/interfaces/IBanchoAPIUserResponse';
import OsuGetRoute from './OsuGetRoute';

export default abstract class OsuUserRoute<
  T extends IOsuUser,
  B extends IBanchoAPIUserResponse,
  P
> extends OsuGetRoute<T, B, P> {}
