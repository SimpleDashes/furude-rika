import IBanchoOsuUserRecentsLimit from '../../bancho/params/IBanchoOsuUserRecentsLimit';
import DroidUser from '../objects/DroidUser';

export default interface IDroidOsuUserRecentsParam
  extends IBanchoOsuUserRecentsLimit {
  u: DroidUser;
}
