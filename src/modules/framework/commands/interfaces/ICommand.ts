import type { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import type ICommandInformation from './ICommandInformation';
import type ICommandContext from '../contexts/ICommandContext';
import type { OmittedCommandContext } from '../contexts/ICommandContext';
import type { TypedArgs } from '../decorators/ContextDecorators';

export default interface ICommand<
  CTX extends ICommandContext<TypedArgs<A>>,
  A
> {
  readonly options: ToAPIApplicationCommandOptions[];
  readonly information: ICommandInformation;
  readonly args: A;

  trigger: (context: CTX) => Promise<void>;
  createContext: (baseContext: OmittedCommandContext) => CTX;
  createArgs: () => A;

  registerOption: <C>(option: C) => C;

  setName: (name: string) => this;
  setDescription: (description: string) => this;
}
