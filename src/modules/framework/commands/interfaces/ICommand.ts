import { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import ICommandInformation from './ICommandInformation';
import ICommandContext from './ICommandContext';

export default interface ICommand<CTX extends ICommandContext> {
  readonly options: ToAPIApplicationCommandOptions[];
  readonly information: ICommandInformation;

  trigger(context: CTX): Promise<void>;
  createContext(baseContext: Omit<ICommandContext, 'build'>): CTX;

  registerOption<C>(option: C): C;

  setName(name: string): this;
  setDescription(description: string): this;
}
