import type { CommandInteraction } from 'discord.js';
import type IBot from '../../client/IBot';

export default interface ICommandContext {
  readonly client: IBot;
  readonly interaction: CommandInteraction;

  build: () => Promise<void>;
}

export type OmittedCommandContext<T extends ICommandContext = ICommandContext> =
  Omit<T, 'build'>;
