import { SlashCommandBuilder } from '@discordjs/builders';
import ICommand from './interfaces/ICommand';
import ICommandInformation from './interfaces/ICommandInformation';
import CommandHelper from './CommandHelper';
import ICommandContext from './interfaces/ICommandContext';

export default abstract class BaseCommand<CTX extends ICommandContext>
  extends SlashCommandBuilder
  implements ICommand<CTX>
{
  public readonly information: ICommandInformation;

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    CommandHelper.setInformation(this, this.information);
  }

  public abstract trigger(context: CTX): Promise<void>;

  public abstract createContext(baseContext: ICommandContext): CTX;

  public registerOption<C>(option: C): C {
    return CommandHelper.registerOption(this, option);
  }
}
