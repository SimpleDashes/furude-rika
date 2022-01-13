import { CommandInteraction } from 'discord.js';
import BaseBot from '../../client/BaseBot';

export default interface ICommandContext {
  readonly client: BaseBot<ICommandContext>;
  readonly interaction: CommandInteraction;

  build(): Promise<void>;
}
