import OsuContext from '../../../../../client/contexts/osu/OsuContext';
import FurudeOperations from '../../../../../database/FurudeOperations';
import { assertDefinedGet } from '../../../../../modules/framework/types/TypeAssertions';
import OsuSubCommand from '../../../wrapper/OsuSubCommand';

export default class OsuSetUser extends OsuSubCommand {
  private serverUserOptions = this.registerServerUserOptions(this, (o) => {
    o.server.setDescription('The server you want to bind your account to.');
    o.user.setRequired(true);
    o.user.setDescription(
      'The user you want to bind your account on the specified server.'
    );
  });

  public constructor() {
    super({
      name: 'user',
      description: 'Set your osu! account on a osu! server',
    });
  }

  public async trigger(context: OsuContext): Promise<void> {
    const { interaction, osuPlayer, localizer } = context;

    const server = this.applyToServerOption(
      this.serverUserOptions.server,
      interaction
    );

    const username = assertDefinedGet(
      this.serverUserOptions.user.apply(interaction)
    );

    const osuUser = await this.getUserFromServer(server, context, username);

    if (!osuUser) {
      await this.sendOsuUserNotFound(context);
      return;
    }

    const operation = osuPlayer.addAccounts(
      {
        [server.name]: osuUser,
      },
      localizer
    );

    await FurudeOperations.saveWhenSuccess(osuPlayer, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
