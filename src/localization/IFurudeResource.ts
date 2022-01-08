import ILocalizerStructure from '../modules/framework/localization/ILocalizerStructure';

export default interface IFurudeResource extends ILocalizerStructure {
  AVATAR_RESPONSE: string;

  PING_TO_PING: string;
  PING_NOT_REACHABLE: string;

  DEPLOY_COMMAND_NOT_FOUND: string;
  DEPLOY_COMMAND_CORRUPTED: string;
  DEPLOY_COMMAND_ERROR: string;
  DEPLOY_COMMAND_SUCCESS: string;

  CALC_RESULTS: string;
  CALC_ADDITIONAL_VARIABLES: string;
  CALC_EVALUATE_ERROR: string;
  CALC_MISSING_VARIABLES: string;

  COIN_FLIP_HEADS: string;
  COIN_FLIP_TAILS: string;
  COIN_FLIP_RESULT: string;

  ERROR_MISSING_PERMISSIONS: string;
  ERROR_OWNER_ONLY_COMMAND: string;
  ERROR_REQUIRES_GUILD: string;

  SUBCOMMAND_ERROR_NOT_FOUND: string;
  SUBCOMMAND_MISSING_REQUIRED: string;

  CUSTOMIZE_LOCALE_RESPONSE_USER: string;
  CUSTOMIZE_LOCALE_RESPONSE_GUILD: string;
  CUSTOMIZE_LOCALE_RESPONSE_GUILD_ANY: string;
  CUSTOMIZE_LOCALE_RESPONSE_CHANNEL: string;
  CUSTOMIZE_LOCALE_RESPONSE_CHANNEL_ANY: string;

  ECONOMY_OPEN_SUCCESS: string;
  ECONOMY_OPEN_FAIL: string;
  ECONOMY_BALANCE_FAIL: string;
  ECONOMY_MUST_HAVE_ACCOUNT: string;

  DATABASE_GUILD_WHITELISTED_XP_CHANNEL: string;
  DATABASE_GUILD_BLACKLISTED_XP_CHANNEL: string;
  DATABASE_GUILD_ALREADY_WHITELISTED_XP_CHANNEL: string;
  DATABASE_GUILD_ALREADY_BLACKLISTED_XP_CHANNEL: string;
  DATABASE_GUILD_CHANGED_TIME_FOR_XP: string;

  DATABASE_CITIZEN_ALREADY_CLAIMED: string;
  DATABASE_CITIZEN_CLAIM_SUCCESS: string;

  REMINDER_NEEDS_TIME_FRAME: string;
  REMINDER_MAX_NUMBER_OF_REMINDERS_REACHED: string;
  REMINDER_WILL_REMIND_YOU: string;
  REMINDER_REMINDING_YOU: string;
  REMINDER_REMOVE_FAIL: string;
  REMINDER_REMOVE_SUCCESS: string;
  REMINDER_WILL_FIRE: string;
  REMINDERS_STRING: string;

  OSU_ACCOUNT_NOT_FOUND: string;
  OSU_USER_ADDED_ACCOUNT: string;

  NOTHING_HERE: string;
}
