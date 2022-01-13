import type IBanchoOsuParam from './IBanchoOsuParam';
import type IBanchoOsuUserRecentsLimit from './IBanchoOsuUserRecentsLimit';
import type IBanchoOsuWithModesParam from './IBanchoOsuWithModesParam';
import type IBanchoOsuWithUserParam from './IBanchoOsuWithUserParam';

export default interface IBanchoOsuUserRecentParams
  extends IBanchoOsuWithUserParam,
    IBanchoOsuWithModesParam,
    IBanchoOsuParam,
    IBanchoOsuUserRecentsLimit {}
