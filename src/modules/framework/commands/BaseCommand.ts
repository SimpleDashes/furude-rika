import { SlashCommandBuilder } from '@discordjs/builders';
import type ICommand from './interfaces/ICommand';
import type ICommandInformation from './interfaces/ICommandInformation';
import CommandHelper from './CommandHelper';
import type ICommandContext from './contexts/ICommandContext';
import type { OmittedCommandContext } from './contexts/ICommandContext';
import type { TypedArgs } from './contexts/types';

export default abstract class BaseCommand<
    CTX extends ICommandContext<TypedArgs<A>>,
    A
  >
  extends SlashCommandBuilder
  implements ICommand<CTX, A>
{
  public readonly args: A;
  public readonly information: ICommandInformation;

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    this.args = this.createArgs();
    CommandHelper.setInformation(this, this.information);
  }

  public abstract trigger(context: CTX): Promise<void>;

  public abstract createContext(baseContext: OmittedCommandContext): CTX;

  public abstract createArgs(): A;

  public registerOption<C>(option: C): C {
    return CommandHelper.registerOption(this, option);
  }
}
