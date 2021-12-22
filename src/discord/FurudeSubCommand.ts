import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../client/FurudeRika';
import IRunsCommand from '../framework/commands/interfaces/IRunsCommand';
import SubCommand from '../framework/commands/SubCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import IFurudeCommand from './IFurudeCommand';

export default abstract class FurudeSubCommand
  extends SubCommand<FurudeRika>
  implements IFurudeCommand
{
  public override createRunner(
    interaction: CommandInteraction<CacheType>
  ): IRunsCommand<FurudeRika> {
    return FurudeCommandWrapper.createRunner(this, interaction);
  }

  public abstract createRunnerRunnable(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void>;
}
