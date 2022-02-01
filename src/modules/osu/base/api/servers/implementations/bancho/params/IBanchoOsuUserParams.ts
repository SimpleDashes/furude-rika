import type OsuUserEventsBindable from '../../../../../bindables/OsuUserEventsBindable';
import type IBanchoOsuParam from './IBanchoOsuParam';
import type IBanchoOsuWithModesParam from './IBanchoOsuWithModesParam';
import type IBanchoOsuWithUserParam from './IBanchoOsuWithUserParam';

export default interface IBanchoOsuUserParams
  extends IBanchoOsuWithUserParam,
    IBanchoOsuParam,
    IBanchoOsuWithModesParam {
  event_days?: OsuUserEventsBindable;
}
