import FurudeResource from '../FurudeResource';
import SupportedFurudeLocales from '../SupportedFurudeLocales';
import CurrencyContainer from '../../containers/CurrencyContainer';

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

      // ECONOMY
      ECONOMY_OPEN_SUCCESS: `Sure, just opened a ${CurrencyContainer.CURRENCY_NAME} account for you...`,
      ECONOMY_OPEN_FAIL: `You already have a ${CurrencyContainer.CURRENCY_NAME} account...`,
      ECONOMY_BALANCE_FAIL: `You or said user doesn't have an open ${CurrencyContainer.CURRENCY_NAME} account...`,
      ECONOMY_MUST_HAVE_ACCOUNT: `You must open a ${CurrencyContainer.CURRENCY_NAME} account to use this command!`,

      DATABASE_CITIZEN_ALREADY_CLAIMED: `You had already claim your daily ${CurrencyContainer.CURRENCY_NAME} today... you can claim again on: [$TIME]`,
      DATABASE_CITIZEN_CLAIM_SUCCESS: `You claimed [$AMOUNT] ${CurrencyContainer.CURRENCY_NAME} today! you are in a [$STREAK] days streak, you now have [$TOTAL] ${CurrencyContainer.CURRENCY_NAME}`,

      // GUILD
      DATABASE_GUILD_WHITELISTED_XP_CHANNEL:
        'Whitelisted the channel: [$CHANNEL] (It is now rewarding experience).',
      DATABASE_GUILD_BLACKLISTED_XP_CHANNEL:
        'Blacklisted the channel: [$CHANNEL] (It is no longer rewarding experience).',
      DATABASE_GUILD_ALREADY_WHITELISTED_XP_CHANNEL:
        '[$CHANNEL] is already whitelisted...',
      DATABASE_GUILD_ALREADY_BLACKLISTED_XP_CHANNEL:
        '[$CHANNEL] is already blacklisted...',
      DATABASE_GUILD_CHANGED_TIME_FOR_XP:
        'Ok, now users need to wait [$TIME] seconds so they get any xp...',

      // REMINDER
      REMINDER_NEEDS_TIME_FRAME:
        'Hey you need to put at least one time frame for the reminder.',
      REMINDER_MAX_NUMBER_OF_REMINDERS_REACHED:
        'You can only have up to [$LIMIT] pending reminders. i am sorry!',
      REMINDER_WILL_REMIND_YOU: 'Ok! i will remind you about that!',
      REMINDER_REMINDING_YOU: 'Reminder: [$TEXT]',
      REMINDER_REMOVE_FAIL: 'Failed to remove reminder at index [$INDEX]',
      REMINDER_REMOVE_SUCCESS: 'Removed the reminder at index [$INDEX]',
      REMINDER_WILL_FIRE: '[$CONTENT] will fire on [$TIME]',
      REMINDERS_STRING: "[$USER]'s reminders",

      // OSU
      OSU_ACCOUNT_NOT_FOUND:
        "I couldn't find any user with that username or id.",
      OSU_USER_ADDED_ACCOUNT:
        'Added the accounts with the usernames [$USERNAME] to the servers [$SERVER] for you.',

      // MISCELLANEOUS
      NOTHING_HERE: 'Nothing to see here.',
    });
  }
}
