import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../client/contexts/DefaultContext';
import FurudeRika from '../../client/FurudeRika';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';

export default class OsuRootCommand extends FurudeCommand {
  public constructor() {
    super({
      name: 'osu',
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
