import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../../client/contexts/DefaultContext';
import FurudeRika from '../../../../client/FurudeRika';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';
import IFurudeRunner from '../../../../discord/commands/interfaces/IFurudeRunner';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class ExperienceLeaderboard extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'leaderboard',
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
