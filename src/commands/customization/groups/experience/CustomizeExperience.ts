import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../../client/FurudeRika';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';
import IFurudeRunner from '../../../../discord/commands/interfaces/IFurudeRunner';
import { RequiresSubCommands } from '../../../../framework/commands/decorators/PreconditionDecorators';

@RequiresSubCommands
export default class CustomizeExperience extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'experience',
      description:
        'Customizes things related to experience. (TL;DR GIMME DATA!!!!)',
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
