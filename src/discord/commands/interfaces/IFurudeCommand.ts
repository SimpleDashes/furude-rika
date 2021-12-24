import { CommandInteraction } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import DefaultContext from '../../../client/contexts/DefaultContext';
import IRunsCommand from '../../../framework/commands/interfaces/IRunsCommand';
import IFurudeRunner from './IFurudeRunner';

export default interface IFurudeCommand {
  ContextType(): (runner: IFurudeRunner<DefaultContext>) => DefaultContext;
  createRunnerRunnable<T extends FurudeRika>(
    runner: IRunsCommand<T>,
    client: T,
    interaction: CommandInteraction
  ): () => Promise<void>;
}
