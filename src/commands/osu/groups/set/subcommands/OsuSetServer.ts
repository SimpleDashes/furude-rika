import assert from 'assert';
import { assertDefined } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import type OsuContext from '../../../../../contexts/osu/OsuContext';
import FurudeOperations from '../../../../../database/FurudeOperations';
import OsuServers from '../../../../../modules/osu/servers/OsuServers';
import type { OsuServerOptions } from '../../../wrapper/OsuSubCommand';
import OsuSubCommand from '../../../wrapper/OsuSubCommand';

type Args = OsuServerOptions & unknown;

@CommandInformation({
  name: 'server',
  description: 'Sets a default osu! server.',
})
export default class OsuSetServer extends OsuSubCommand<Args> {
  public createArguments(): Args {
    return {
      ...((): OsuServerOptions => {
        const serverOptions = this.getServerOptions();
        serverOptions.server
          .setDescription('The server you want to default to.')
          .setRequired(true);
        return serverOptions;
      })(),
    };
  }

  public async trigger(context: OsuContext<Args>): Promise<void> {
    const { dbUser, args, interaction } = context;
    const { server } = args;
    const { osuPlayer } = dbUser;

    assertDefined(server);
    assert(typeof server === 'string');

    const selectedServer = OsuServers.getFromString(server);
    assertDefined(selectedServer);

    const operation = osuPlayer.setPreferredServer(context, selectedServer);

    await FurudeOperations.saveWhenSuccess(osuPlayer, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }
}
