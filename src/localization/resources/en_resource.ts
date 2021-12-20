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

      // COIN FLIP
      COIN_FLIP_HEADS: 'Heads',
      COIN_FLIP_TAILS: 'Tails',
      COIN_FLIP_RESULT: 'The result is: [$RES]',

      // ERRORS
      ERROR_MISSING_PERMISSIONS:
        "You don't have enough permission to be able to execute this command!",
      ERROR_OWNER_ONLY_COMMAND:
        'This command can only be executed by my developers!',
    });
  }
}
