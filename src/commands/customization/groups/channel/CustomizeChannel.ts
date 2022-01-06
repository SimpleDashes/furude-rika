import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../../client/FurudeRika';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';
import IFurudeRunner from '../../../../discord/commands/interfaces/IFurudeRunner';
import { RequiresSubCommands } from '../../../../modules/framework/commands/decorators/PreconditionDecorators';

@RequiresSubCommands
export default class CustomizeChannel extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'channel',
      description:
        'Customizes things related to the current channel you are in.',
    });
  }
  public createRunnerRunnable(
    _runner: IFurudeRunner<any>,
    _client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    throw new Error('Method not implemented.');
  }
}
