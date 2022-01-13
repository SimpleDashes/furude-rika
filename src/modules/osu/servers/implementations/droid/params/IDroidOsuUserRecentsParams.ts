import type IBanchoOsuUserRecentsLimit from '../../bancho/params/IBanchoOsuUserRecentsLimit';
import type DroidUser from '../objects/DroidUser';

export default interface IDroidOsuUserRecentsParam
  extends IBanchoOsuUserRecentsLimit {
  u: DroidUser;
}
