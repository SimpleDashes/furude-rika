import FurudeResource from '../FurudeResource';
import SupportedFurudeLocales from '../SupportedFurudeLocales';

export default class extends FurudeResource {
  public constructor() {
    super(SupportedFurudeLocales.pt_br, {
      // AVATAR
      AVATAR_RESPONSE: 'Aqui, toma o avatar do [$USER]',

      // PING
      PING_TO_PING: 'Pinguei em [$PING]ms',
      PING_NOT_REACHABLE: 'Não consegui pingar...',

      // DEPLOY
      DEPLOY_COMMAND_NOT_FOUND:
        "The specified command wasn't found on my commands list.",
      DEPLOY_COMMAND_CORRUPTED: 'The specified command is likely corrupt.',
      DEPLOY_COMMAND_ERROR: 'Error deploying the specified command.',
      DEPLOY_COMMAND_SUCCESS: 'Deployed the specified command successfully.',
    });
  }
}
