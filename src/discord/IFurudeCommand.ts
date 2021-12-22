import { CommandInteraction } from 'discord.js';
import FurudeRika from '../client/FurudeRika';

export default interface IFurudeCommand {
  createRunnerRunnable(
    client: FurudeRika,
    interaction: CommandInteraction
  ): () => Promise<void>;
}
