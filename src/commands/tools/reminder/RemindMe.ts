import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeRika from '../../../client/FurudeRika';
import FurudeCommand from '../../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import { RequiresSubCommands } from '../../../framework/commands/decorators/PreconditionDecorators';

@RequiresSubCommands
export default class RemindMe extends FurudeCommand {
  public constructor() {
    super({
      name: 'reminder',
      description:
        'Setups a little reminder for you to get your lazy uwu working on next time.',
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
