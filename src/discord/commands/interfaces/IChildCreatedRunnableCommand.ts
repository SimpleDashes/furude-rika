import { CacheType, CommandInteraction } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import IFurudeRunner from './IFurudeRunner';

/**
 * This class can be used for parent class who may check some conditions
 * before actually running the command.
 */
export default interface IChildCreatedRunnableCommand {
  createRunnerRunnableInternally(
    runner: IFurudeRunner<any>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void>;
}
