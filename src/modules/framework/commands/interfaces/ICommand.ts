import type { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import type ICommandInformation from './ICommandInformation';
import type ICommandContext from './ICommandContext';
import type { OmittedCommandContext } from './ICommandContext';

export default interface ICommand<CTX extends ICommandContext> {
  readonly options: ToAPIApplicationCommandOptions[];
  readonly information: ICommandInformation;

  trigger: (context: CTX) => Promise<void>;
  createContext: (baseContext: OmittedCommandContext) => CTX;

  registerOption: <C>(option: C) => C;

  setName: (name: string) => this;
  setDescription: (description: string) => this;
}
