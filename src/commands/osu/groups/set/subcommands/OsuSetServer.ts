import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import type OsuContext from '../../../../../contexts/osu/OsuContext';
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
        serverOptions.server.setRequired(true);
        return serverOptions;
      })(),
    };
  }

  public async trigger(context: OsuContext<Args>): Promise<void> {
    await context.interaction.reply('UWUs');
  }
}
