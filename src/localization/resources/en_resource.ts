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
      ERROR_REQUIRES_GUILD:
        'I am so sorry, but this command must be executed on a server...',

      // SUBCOMMANDS
      SUBCOMMAND_ERROR_NOT_FOUND:
        "Sorry i couldn't find the subcommand you are looking for!",
      SUBCOMMAND_MISSING_REQUIRED:
        'You need to choose a subcommand to be able to run this command!',

      // CUSTOMIZE
      CUSTOMIZE_LOCALE_RESPONSE_USER:
        'Damn, you want me to respond you that way, sure!',
      CUSTOMIZE_LOCALE_RESPONSE_GUILD:
        'HEY! now i am going to respond you in this server just in english, sup!',
      CUSTOMIZE_LOCALE_RESPONSE_GUILD_ANY:
        'Oh sure, i will let users pick their preferred language then!',
      CUSTOMIZE_LOCALE_RESPONSE_CHANNEL:
        'Oh sure, then i will be speaking in english in this channel!',
      CUSTOMIZE_LOCALE_RESPONSE_CHANNEL_ANY:
        'Oh sure, i will let the users speak this server default language in this channel...',
    });
  }
}
