import { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import ICommandInformation from './ICommandInformation';
import IRunsCommand from './IRunsCommand';
import BaseBot from '../../client/BaseBot';
import { CommandInteraction } from 'discord.js';

export default interface ICommand<
  T extends BaseBot,
  THIS extends ICommand<T, THIS>
> {
  readonly options: ToAPIApplicationCommandOptions[];
  readonly information: ICommandInformation;
  createRunner(interaction: CommandInteraction): Promise<IRunsCommand<T>>;
  registerOption<C>(option: C): C;
  setName(name: string): THIS;
  setDescription(description: string): THIS;
}
