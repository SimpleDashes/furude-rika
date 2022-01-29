import { Locale, ResourceValue } from 'discowork';
import FurudeResource from '../FurudeResource';
import { ResourceArguments } from '../FurudeResourceStructure';

export default class extends FurudeResource {
  public constructor() {
    super(Locale.en, {
      avatar: {
        response: new ResourceValue(
          (b) => `Here, ${b.USER}'s avatar for ya`,
          [ResourceArguments.USER]
        ),
      },

      ping: {
        response: new ResourceValue(
          (b) => `${b.PING}ms to ping`,
          [ResourceArguments.PING]
        ),
        unreachable: new ResourceValue(() => 'Not reachable.', []),
      },

      deploy: {
        command: {
          missing: new ResourceValue(
            () => "The specified command wasn't found on my commands list.",
            []
          ),
          corrupted: new ResourceValue(
            () => 'The specified command is likely corrupt.',
            []
          ),
          error: new ResourceValue(
            () => 'Error deploying the specified command.',
            []
          ),
          success: new ResourceValue(
            () => 'Deployed the specified command successfully.',
            []
          ),
        },
      },

      calc: {
        response: new ResourceValue(
          (b) => `${b.EXPRESSION} equals to: ${b.RESULT}`,
          [ResourceArguments.EXPRESSION, ResourceArguments.RESULT]
        ),
        fail: new ResourceValue(
          (b) =>
            `Maybe i am dumb or whatever, but i don't think ${b.EXPRESSION} is a mathematical expression.`,
          [ResourceArguments.EXPRESSION]
        ),
        variables: {
          description: new ResourceValue(
            (b) =>
              `With the variables for the expression being: ${b.VARIABLES}`,
            [ResourceArguments.VARIABLES]
          ),
          missing: new ResourceValue(
            (b) =>
              `You forgot to add the following variables: ${b.VARIABLES}, for the expression: ${b.EXPRESSION}`,
            [ResourceArguments.VARIABLES, ResourceArguments.EXPRESSION]
          ),
        },
      },

      coin: {
        heads: new ResourceValue(() => 'Heads', []),
        tails: new ResourceValue(() => 'Tails', []),
        response: new ResourceValue(
          (b) => `I flipped a coin for you... it end up landing on ${b.SIDE}`,
          [ResourceArguments.SIDE]
        ),
      },

      command: {
        error: {
          missing_permissions: new ResourceValue(
            () =>
              "You don't have enough permission to be able to execute this command!",
            []
          ),
          owner_only: new ResourceValue(
            () => 'This command can only be executed by my developers!',
            []
          ),
          requires_guild: new ResourceValue(
            () =>
              'I am so sorry, but this command must be executed on a server...',
            []
          ),
        },

        subcommand: {
          error: {
            required: new ResourceValue(
              () => "Sorry i couldn't find the subcommand you are looking for!",
              []
            ),
          },
          group: {
            error: {
              required: new ResourceValue(
                () =>
                  'You need to choose a subcommand to be able to run this command!',
                []
              ),
            },
          },
        },
      },

      customize: {
        locale: {
          user: {
            response: new ResourceValue(
              () => 'Damn, you want me to respond you that way, sure!',
              []
            ),
          },
          guild: {
            responses: {
              default: new ResourceValue(
                () =>
                  'Now i am gonna answer members on this server in english...',
                []
              ),
              any: new ResourceValue(
                () =>
                  'Oh sure, i will let users pick their preferred language then!',
                []
              ),
            },
          },
          channel: {
            responses: {
              default: new ResourceValue(
                () =>
                  'Oh sure, then i will be speaking in english in this channel!',
                []
              ),
              any: new ResourceValue(
                () =>
                  'Oh sure, i will let the users speak this server default language in this channel...',
                []
              ),
            },
          },
        },
      },

      economy: {
        open: {
          success: new ResourceValue(
            (b) => `Sure, just opened a ${b.CURRENCY_NAME} account for you...`,
            [ResourceArguments.CURRENCY_NAME]
          ),
          fail: new ResourceValue(
            (b) => `You already have a ${b.CURRENCY_NAME} account...`,
            [ResourceArguments.CURRENCY_NAME]
          ),
        },
        balance: {
          fail: new ResourceValue(
            (b) =>
              `You or said user doesn't have an open ${b.CURRENCY_NAME} account...`,
            [ResourceArguments.CURRENCY_NAME]
          ),
        },
        error: {
          no_account: new ResourceValue(
            (b) =>
              `You must open a ${b.CURRENCY_NAME} account to use this command!`,
            [ResourceArguments.CURRENCY_NAME]
          ),
        },
      },

      database: {
        guild: {
          xp: {
            channels: {
              whitelisted: new ResourceValue(
                (b) =>
                  `Whitelisted the channel: ${b.CHANNEL} (It is now rewarding experience).`,
                [ResourceArguments.CHANNEL]
              ),
              blacklisted: new ResourceValue(
                (b) =>
                  `Blacklisted the channel: ${b.CHANNEL} (It is no longer rewarding experience).`,
                [ResourceArguments.CHANNEL]
              ),
              already: {
                whitelisted: new ResourceValue(
                  (b) => `${b.CHANNEL} is already whitelisted...`,
                  [ResourceArguments.CHANNEL]
                ),
                blacklisted: new ResourceValue(
                  (b) => `${b.CHANNEL} is already blacklisted...`,
                  [ResourceArguments.CHANNEL]
                ),
              },
            },
            time: {
              changed: new ResourceValue(
                (b) =>
                  `Ok, now users need to wait ${b.TIME} seconds so they get any xp...`,
                [ResourceArguments.TIME]
              ),
            },
          },
        },
        citizen: {
          claims: {
            fail: new ResourceValue(
              (b) =>
                `You had already claim your daily ${b.CURRENCY_NAME} today... you can claim again on: ${b.TIME}`,
              [ResourceArguments.TIME, ResourceArguments.CURRENCY_NAME]
            ),
            success: new ResourceValue(
              (b) =>
                `You claimed ${b.AMOUNT} ${b.CURRENCY_NAME} today! you are in ${b.STREAK} days streak, you now have ${b.TOTAL} ${b.CURRENCY_NAME}`,
              [
                ResourceArguments.STREAK,
                ResourceArguments.AMOUNT,
                ResourceArguments.TOTAL,
                ResourceArguments.CURRENCY_NAME,
              ]
            ),
          },
        },
      },

      reminder: {
        error: {
          no_time_frame: new ResourceValue(
            () =>
              'Hey you need to put at least one time frame for the reminder.',
            []
          ),
          max_reached: new ResourceValue(
            (b) =>
              `You can only have up to ${b.LIMIT} concurrent reminders. i am sorry!`,
            [ResourceArguments.LIMIT]
          ),
        },
        remove: {
          success: new ResourceValue(
            (b) => `Removed the reminder at index ${b.INDEX}`,
            [ResourceArguments.INDEX]
          ),
          fail: new ResourceValue(
            (b) => `Failed to remove reminder at index ${b.INDEX}`,
            [ResourceArguments.INDEX]
          ),
        },
        reminding: new ResourceValue(
          (b) => `Reminder: ${b.CONTENT}`,
          [ResourceArguments.CONTENT]
        ),
        will_remind: new ResourceValue(
          () => 'Ok! i will remind you about that!',
          []
        ),
        will_fire: new ResourceValue(
          (b) => `${b.CONTENT} will fire on ${b.TIME}`,
          [ResourceArguments.CONTENT, ResourceArguments.TIME]
        ),
        string: new ResourceValue(
          (b) => `${b.USER}'s reminders.`,
          [ResourceArguments.USER]
        ),
      },

      osu: {
        account: {
          added: new ResourceValue(
            (b) =>
              `Added the accounts with the usernames ${b.USERNAME} to the servers ${b.OSU_SERVER} for you.`,
            [ResourceArguments.USERNAME, ResourceArguments.OSU_SERVER]
          ),
          error: {
            not_found: new ResourceValue(
              () => "I couldn't find any user with that username or id.",
              []
            ),
          },
        },
        preferred_server: {
          changed: new ResourceValue(
            (b) => `Changed you preferred osu! server to ${b.OSU_SERVER}`,
            [ResourceArguments.OSU_SERVER]
          ),
          already_prefer_this_server: new ResourceValue(
            () =>
              'You already have the selected server as your preferred server...',
            []
          ),
        },
      },

      errors: {
        nothing_here: new ResourceValue(() => 'Nothing to see here.', []),
      },
    });
  }
}
