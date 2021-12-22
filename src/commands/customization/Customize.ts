import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultDependency from '../../client/providers/DefaultDependency';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import { RequiresSubCommands } from '../../framework/commands/decorators/PreconditionDecorators';
import IRunsCommand from '../../framework/commands/interfaces/IRunsCommand';
import Constructor from '../../framework/interfaces/Constructor';

@RequiresSubCommands
export default class extends FurudeCommand {
  public constructor() {
    super({
      name: 'customize',
      description: 'customizes information about you, GIMME YOUR DATA1!!11!',
    });
  }

  public createRunnerRunnable(
    _runner: IRunsCommand<FurudeRika>,
    _client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    throw new Error('Method not implemented.');
  }
}
