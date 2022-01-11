import { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import ICommandInformation from './ICommandInformation';
import BaseBot from '../../client/BaseBot';
import ICommandContext from './ICommandContext';

export default interface ICommand<
  T extends BaseBot,
  CTX extends ICommandContext<T>
> {
  readonly options: ToAPIApplicationCommandOptions[];
  readonly information: ICommandInformation;

  trigger(context: CTX): Promise<void>;
  createContext(baseContext: Omit<ICommandContext<T>, 'build'>): CTX;

  registerOption<C>(option: C): C;

  setName(name: string): this;
  setDescription(description: string): this;
}
