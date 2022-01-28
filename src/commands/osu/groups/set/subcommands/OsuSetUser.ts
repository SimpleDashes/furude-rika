import { assertDefined } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import type OsuContext from '../../../../../contexts/osu/OsuContext';
import FurudeOperations from '../../../../../database/FurudeOperations';
import type { OsuServerUserOptions } from '../../../wrapper/OsuSubCommand';
import OsuSubCommand from '../../../wrapper/OsuSubCommand';

type Args = unknown & OsuServerUserOptions;

@CommandInformation({
  name: 'user',
  description: 'Set your osu! account on a osu! server.',
})
export default class OsuSetUser extends OsuSubCommand<Args> {
  public createArguments(): Args {
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

  public async trigger(context: OsuContext<Args>): Promise<void> {
    const { interaction, dbUser, args } = context;
    const { osuPlayer } = dbUser;
    const { username } = args;

    assertDefined(username);

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
