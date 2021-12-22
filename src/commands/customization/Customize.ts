import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import FurudeCommand from '../../discord/FurudeCommand';
import { RequiresSubCommands } from '../../framework/commands/decorators/PreconditionDecorators';

@RequiresSubCommands
export default class extends FurudeCommand {
  public constructor() {
    super({
      name: 'customize',
      description: 'customizes information about you, GIMME YOUR DATA1!!11!',
    });
  }

  public createRunnerRunnable(
    _client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    throw new Error('Method not implemented.');
  }
}
