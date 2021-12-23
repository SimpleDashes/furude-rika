import { CommandInteraction } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import DefaultDependency from '../../../client/providers/DefaultDependency';
import IRunsCommand from '../../../framework/commands/interfaces/IRunsCommand';
import IFurudeRunner from './IFurudeRunner';

export default interface IFurudeCommand {
  dependencyType(): (
    runner: IFurudeRunner<DefaultDependency>
  ) => DefaultDependency;
  createRunnerRunnable<T extends FurudeRika>(
    runner: IRunsCommand<T>,
    client: T,
    interaction: CommandInteraction
  ): () => Promise<void>;
}
