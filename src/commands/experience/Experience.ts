import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../client/contexts/DefaultContext';
import FurudeRika from '../../client/FurudeRika';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import { RequiresSubGroups } from '../../framework/commands/decorators/PreconditionDecorators';

@RequiresSubGroups
export default class Experience extends FurudeCommand {
  public constructor() {
    super({
      name: 'experience',
      description: '.',
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
