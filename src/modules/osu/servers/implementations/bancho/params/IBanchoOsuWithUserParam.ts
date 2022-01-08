import OsuUserType from '../../../../enums/OsuUserType';

export default interface IBanchoOsuWithUserParam {
  u: string | number;
  type?: OsuUserType | string;
}
