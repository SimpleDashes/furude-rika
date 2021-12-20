import ILocalizerStructure from '../framework/localization/ILocalizerStructure';

export default interface IFurudeResource extends ILocalizerStructure {
  AVATAR_RESPONSE: string;

  PING_TO_PING: string;
  PING_NOT_REACHABLE: string;

  DEPLOY_COMMAND_NOT_FOUND: string;
  DEPLOY_COMMAND_CORRUPTED: string;
  DEPLOY_COMMAND_ERROR: string;
  DEPLOY_COMMAND_SUCCESS: string;

  CALC_RESULTS: string;
}
