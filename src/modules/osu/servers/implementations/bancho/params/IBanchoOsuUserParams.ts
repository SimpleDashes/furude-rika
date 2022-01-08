import OsuUserEventsBindable from '../../../../bindables/OsuUserEventsBindable';
import IBanchoOsuParam from './IBanchoOsuParam';
import IBanchoOsuWithModesParam from './IBanchoOsuWithModesParam';
import IBanchoOsuWithUserParam from './IBanchoOsuWithUserParam';

export default interface IBanchoOsuUserParams
  extends IBanchoOsuWithUserParam,
    IBanchoOsuParam,
    IBanchoOsuWithModesParam {
  event_days?: OsuUserEventsBindable;
}
