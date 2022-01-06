import OsuUserEventsBindable from '../../../../bindables/OsuUserEventsBindable';
import OsuModes from '../../../../enums/OsuModes';
import OsuUserType from '../../../../enums/OsuUserType';

export default interface IBaseBanchoOsuUserParam {
  u: string | number;
  m?: OsuModes | number;
  type?: OsuUserType | string;
  event_days?: OsuUserEventsBindable;
}
