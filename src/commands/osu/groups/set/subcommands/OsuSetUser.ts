import { CommandInteraction, CacheType } from 'discord.js';
import OsuContext from '../../../../../client/contexts/osu/OsuContext';
import FurudeRika from '../../../../../client/FurudeRika';
import FurudeOperations from '../../../../../database/FurudeOperations';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
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

  public createRunnerRunnable(
    runner: IFurudeRunner<OsuContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const server = this.applyToServerOption(
        this.serverUserOptions.server,
        interaction
      );

      const osuUser = await this.getUserFromServer(
        server,
        runner,
        this.serverUserOptions.user.apply(interaction)!
      );

      if (!osuUser) {
        await this.sendOsuUserNotFound(runner);
        return;
      }

      const operation = runner.args!.osuPlayer.addAccounts(
        {
          [server.name]: osuUser,
        },
        runner.args!.localizer
      );

      await FurudeOperations.saveWhenSuccess(runner.args!.osuPlayer, operation);
      await FurudeOperations.answerInteraction(interaction, operation);
    };
  }
}
