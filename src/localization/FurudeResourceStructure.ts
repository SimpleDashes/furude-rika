import type ResourceValue from 'discowork/src/localization/resources/ResourceValue';

enum ResourceArguments {
  USER = 'USER',
  PING = 'PING',
  EXPRESSION = 'EXPRESSION',
  VARIABLES = 'VARIABLES',
  RESULT = 'RESULT',
  SIDE = 'SIDE',
  CHANNEL = 'CHANNEL',
  TIME = 'TIME',
  INDEX = 'INDEX',
  USERNAME = 'USERNAME',
  OSU_SERVER = 'OSU_SERVER',
  CONTENT = 'CONTENT',
  LIMIT = 'LIMIT',
  AMOUNT = 'AMOUNT',
  STREAK = 'STREAK',
  TOTAL = 'TOTAL',
  CURRENCY_NAME = 'CURRENCY_NAME',
}

export { ResourceArguments };

type USER = typeof ResourceArguments.USER;
type PING = typeof ResourceArguments.PING;
type EXPRESSION = typeof ResourceArguments.EXPRESSION;
type VARIABLES = typeof ResourceArguments.VARIABLES;
type RESULT = typeof ResourceArguments.RESULT;
type SIDE = typeof ResourceArguments.SIDE;
type CHANNEL = typeof ResourceArguments.CHANNEL;
type TIME = typeof ResourceArguments.TIME;
type INDEX = typeof ResourceArguments.INDEX;
type USERNAME = typeof ResourceArguments.USERNAME;
type OSU_SERVER = typeof ResourceArguments.OSU_SERVER;
type CONTENT = typeof ResourceArguments.CONTENT;
type LIMIT = typeof ResourceArguments.LIMIT;
type AMOUNT = typeof ResourceArguments.AMOUNT;
type STREAK = typeof ResourceArguments.STREAK;
type TOTAL = typeof ResourceArguments.TOTAL;
type CURRENCY_NAME = typeof ResourceArguments.CURRENCY_NAME;

type FurudeResourceStructure = {
  avatar: {
    response: ResourceValue<USER>;
  };

  ping: {
    response: ResourceValue<PING>;
    unreachable: ResourceValue;
  };

  deploy: {
    command: {
      missing: ResourceValue;
      corrupted: ResourceValue;
      error: ResourceValue;
      success: ResourceValue;
    };
  };

  calc: {
    response: ResourceValue<EXPRESSION | RESULT>;
    fail: ResourceValue<EXPRESSION>;
    variables: {
      description: ResourceValue<VARIABLES>;
      missing: ResourceValue<VARIABLES | EXPRESSION>;
    };
  };

  coin: {
    heads: ResourceValue;
    tails: ResourceValue;
    response: ResourceValue<SIDE>;
  };

  command: {
    error: {
      missing_permissions: ResourceValue;
      owner_only: ResourceValue;
      requires_guild: ResourceValue;
    };
    subcommand: {
      error: {
        required: ResourceValue;
      };
      group: {
        error: {
          required: ResourceValue;
        };
      };
    };
  };

  customize: {
    locale: {
      user: {
        response: ResourceValue;
      };
      guild: {
        responses: {
          default: ResourceValue;
          any: ResourceValue;
        };
      };
      channel: {
        responses: {
          default: ResourceValue;
          any: ResourceValue;
        };
      };
    };
  };

  economy: {
    open: {
      success: ResourceValue<CURRENCY_NAME>;
      fail: ResourceValue<CURRENCY_NAME>;
    };
    balance: {
      fail: ResourceValue<CURRENCY_NAME>;
    };
    error: {
      no_account: ResourceValue<CURRENCY_NAME>;
    };
  };

  database: {
    guild: {
      xp: {
        channels: {
          whitelisted: ResourceValue<CHANNEL>;
          blacklisted: ResourceValue<CHANNEL>;
          already: {
            whitelisted: ResourceValue<CHANNEL>;
            blacklisted: ResourceValue<CHANNEL>;
          };
        };
        time: {
          changed: ResourceValue<TIME>;
        };
      };
    };
    citizen: {
      claims: {
        fail: ResourceValue<TIME | CURRENCY_NAME>;
        success: ResourceValue<AMOUNT | STREAK | TOTAL | CURRENCY_NAME>;
      };
    };
  };

  reminder: {
    error: {
      no_time_frame: ResourceValue;
      max_reached: ResourceValue<LIMIT>;
    };
    remove: {
      success: ResourceValue<INDEX>;
      fail: ResourceValue<INDEX>;
    };
    reminding: ResourceValue<CONTENT>;
    will_remind: ResourceValue;
    will_fire: ResourceValue<CONTENT | TIME>;
    string: ResourceValue<USER>;
  };

  osu: {
    account: {
      added: ResourceValue<USERNAME | OSU_SERVER>;
      error: {
        not_found: ResourceValue;
      };
    };
  };

  errors: {
    nothing_here: ResourceValue;
  };
};

export default FurudeResourceStructure;
