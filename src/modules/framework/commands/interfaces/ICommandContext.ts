import { CommandInteraction } from 'discord.js';
import BaseBot from '../../client/BaseBot';

export default interface ICommandContext<T extends BaseBot> {
  readonly client: T;
  readonly interaction: CommandInteraction;

  build(): Promise<void>;
}
