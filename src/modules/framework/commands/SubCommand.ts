import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import BaseBot from '../client/BaseBot';
import CommandHelper from './CommandHelper';
import ICommand from './interfaces/ICommand';
import ICommandContext from './interfaces/ICommandContext';
import ICommandInformation from './interfaces/ICommandInformation';

export default abstract class SubCommand<
    T extends BaseBot,
    CTX extends ICommandContext<T>
  >
  extends SlashCommandSubcommandBuilder
  implements ICommand<T, CTX>
{
  public readonly information: ICommandInformation;

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    CommandHelper.setInformation(this, this.information);
  }

  public abstract trigger(context: CTX): Promise<void>;

  public abstract createContext(baseContext: ICommandContext<T>): CTX;

  public registerOption<C>(option: C): C {
    return CommandHelper.registerOption(this, option);
  }
}
