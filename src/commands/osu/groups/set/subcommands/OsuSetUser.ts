import type OsuContext from '../../../../../client/contexts/osu/OsuContext';
import FurudeOperations from '../../../../../database/FurudeOperations';
import type { TypedArgs } from '../../../../../modules/framework/commands/contexts/types';
import { assertDefinedGet } from '../../../../../modules/framework/types/TypeAssertions';
import type { OsuServerUserOptions } from '../../../wrapper/OsuSubCommand';
import OsuSubCommand from '../../../wrapper/OsuSubCommand';

type Args = unknown & OsuServerUserOptions;

export default class OsuSetUser extends OsuSubCommand<Args> {
  public createArgs(): Args {
    return {
      ...((): OsuServerUserOptions => {
        const args = this.getOsuServerUserOptions();
        args.server.setDescription(
          'The server you want to bind your account to.'
        );
        args.username.setRequired(true);
        args.username.setDescription(
          'The user you want to bind your account on the specified server.'
        );
        return args;
      })(),
    };
  }

  public constructor() {
    super({
      name: 'user',
      description: 'Set your osu! account on a osu! server',
    });
  }

  public async trigger(context: OsuContext<TypedArgs<Args>>): Promise<void> {
    const { interaction, osuPlayer, args } = context;
    const { username } = args;

    assertDefinedGet(username);

    const server = this.applyToServerOption(context);
    const osuUser = await this.getUserFromServer(context);

    if (!osuUser) {
      await this.sendOsuUserNotFound(context);
      return;
    }

    const operation = osuPlayer.addAccounts(context, {
      [server.name]: osuUser,
    });

    await FurudeOperations.saveWhenSuccess(osuPlayer, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
