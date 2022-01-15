import type { CommandInteraction } from 'discord.js';
import type IBot from '../../client/IBot';

export default interface ICommandContext<A = unknown> {
  readonly client: IBot;
  readonly interaction: CommandInteraction;
  args: A;

  build: () => Promise<void>;
}

export type OmittedCommandContext<T extends ICommandContext = ICommandContext> =
  Omit<T, 'build' | 'args' | 'setArgs'>;
