import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import BaseCommand from '../../modules/framework/commands/BaseCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import IFurudeCommand from './interfaces/IFurudeCommand';
import IFurudeRunner from './interfaces/IFurudeRunner';

export default abstract class FurudeCommand
  extends BaseCommand<FurudeRika>
  implements IFurudeCommand
{
  public override async createRunner(
    interaction: CommandInteraction<CacheType>
  ): Promise<IFurudeRunner<any>> {
    return await FurudeCommandWrapper.createRunner(this, interaction);
  }

  public abstract createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void>;

  public ContextType(): (runner: IFurudeRunner<any>) => DefaultContext {
    return FurudeCommandWrapper.defaultDependencyType();
  }
}
