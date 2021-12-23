import FurudeResource from '../FurudeResource';
import SupportedFurudeLocales from '../SupportedFurudeLocales';

export default class extends FurudeResource {
  public constructor() {
    super(SupportedFurudeLocales.english, {
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
      CALC_ADDITIONAL_VARIABLES:
        'With the variables for the expression being: [$VARS]',
      CALC_EVALUATE_ERROR:
        "Maybe i am dumb or whatever, but i don't think [$EXPR] is a mathematical expression.",
      CALC_MISSING_VARIABLES:
        'You forgot to add the following variables: [$VARS], for the expression: [$EXPR]',

      // COIN FLIP
      COIN_FLIP_HEADS: 'Heads',
      COIN_FLIP_TAILS: 'Tails',
      COIN_FLIP_RESULT: 'The result is: [$RES]',

      // ERRORS
      ERROR_MISSING_PERMISSIONS:
        "You don't have enough permission to be able to execute this command!",
      ERROR_OWNER_ONLY_COMMAND:
        'This command can only be executed by my developers!',

      // SUBCOMMANDS
      SUBCOMMAND_ERROR_NOT_FOUND:
        "Sorry i couldn't find the subcommand you are looking for!",
      SUBCOMMAND_MISSING_REQUIRED:
        'You need to choose a subcommand to be able to run this command!s',

      // CUSTOMIZE
      CUSTOMIZE_LOCALE_RESPONSE:
        'Hey i am now going to respond you in the language: [$LOCALE]',
    });
  }
}
