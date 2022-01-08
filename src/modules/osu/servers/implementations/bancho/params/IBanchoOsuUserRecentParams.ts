import IBanchoOsuParam from './IBanchoOsuParam';
import IBanchoOsuUserRecentsLimit from './IBanchoOsuUserRecentsLimit';
import IBanchoOsuWithModesParam from './IBanchoOsuWithModesParam';
import IBanchoOsuWithUserParam from './IBanchoOsuWithUserParam';

export default interface IBanchoOsuUserRecentParams
  extends IBanchoOsuWithUserParam,
    IBanchoOsuWithModesParam,
    IBanchoOsuParam,
    IBanchoOsuUserRecentsLimit {}
