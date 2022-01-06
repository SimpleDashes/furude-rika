import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../client/contexts/DefaultContext';
import FurudeRika from '../../client/FurudeRika';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import { RequiresSubCommands } from '../../modules/framework/commands/decorators/PreconditionDecorators';

@RequiresSubCommands
export default class Economy extends FurudeCommand {
  public constructor() {
    super({
      name: 'economy',
      description: 'Economy, related commands all of then here...',
    });
  }
  public createRunnerRunnable(
    _runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    throw new Error('Method not implemented.');
  }
}
