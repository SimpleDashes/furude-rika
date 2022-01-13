import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import CommandHelper from './CommandHelper';
import type ICommand from './interfaces/ICommand';
import type ICommandContext from './interfaces/ICommandContext';
import type { OmittedCommandContext } from './interfaces/ICommandContext';
import type ICommandInformation from './interfaces/ICommandInformation';

export default abstract class SubCommand<CTX extends ICommandContext>
  extends SlashCommandSubcommandBuilder
  implements ICommand<CTX>
{
  public readonly information: ICommandInformation;

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    CommandHelper.setInformation(this, this.information);
  }

  public abstract trigger(context: CTX): Promise<void>;

  public abstract createContext(baseContext: OmittedCommandContext): CTX;

  public registerOption<C>(option: C): C {
    return CommandHelper.registerOption(this, option);
  }
}
