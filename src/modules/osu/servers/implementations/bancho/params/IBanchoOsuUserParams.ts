import OsuUserEventsBindable from '../../../../bindables/OsuUserEventsBindable';
import OsuModes from '../../../../enums/OsuModes';
import OsuUserType from '../../../../enums/OsuUserType';
import IBanchoOsuParam from './IBanchoOsuParam';

export default interface IBanchoOsuUserParams extends IBanchoOsuParam {
  u: string | number;
  m?: OsuModes | number;
  type?: OsuUserType | string;
  event_days?: OsuUserEventsBindable;
}
