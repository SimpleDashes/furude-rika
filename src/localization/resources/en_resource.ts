import FurudeResource from '../FurudeResource';
import SupportedFurudeLocales from '../SupportedFurudeLocales';

export default class extends FurudeResource {
  public constructor() {
    super(SupportedFurudeLocales.en, {
      // AVATAR
      AVATAR_RESPONSE: "Here, [$USER]'s avatar for ya",

      // PING
      PING_TO_PING: '[$PING]ms to ping',
      PING_NOT_REACHABLE: 'Not reachable',

      // DEPLOY
      DEPLOY_COMMAND_NOT_FOUND:
        "The specified command wasn't found on my commands list.",
      DEPLOY_COMMAND_CORRUPTED: 'The specified command is likely corrupt.',
      DEPLOY_COMMAND_ERROR: 'Error deploying the specified command.',
      DEPLOY_COMMAND_SUCCESS: 'Deployed the specified command successfully.',

      // CALC
      CALC_RESULTS: '[$EXPR] result in: [$RES]',
    });
  }
}
