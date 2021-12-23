import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultDependency from '../../client/providers/DefaultDependency';
import CommandGroup from '../../framework/commands/CommandGroup';
import FurudeCommandWrapper from './FurudeCommandWrapper';
import IFurudeCommand from './interfaces/IFurudeCommand';
import IFurudeRunner from './interfaces/IFurudeRunner';

export default abstract class FurudeCommandGroup
  extends CommandGroup<FurudeRika>
  implements IFurudeCommand
{
  public override async createRunner(
    interaction: CommandInteraction<CacheType>
  ): Promise<IFurudeRunner<any>> {
    return await FurudeCommandWrapper.createRunner(this, interaction);
  }

  public abstract createRunnerRunnable(
    runner: IFurudeRunner<any>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void>;

  public dependencyType(): (runner: IFurudeRunner<any>) => DefaultDependency {
    return FurudeCommandWrapper.defaultDependencyType();
  }
}
