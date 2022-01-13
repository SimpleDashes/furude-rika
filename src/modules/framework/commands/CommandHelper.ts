import { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import ICommand from './interfaces/ICommand';
import ICommandContext from './interfaces/ICommandContext';
import ICommandInformation from './interfaces/ICommandInformation';

export default class CommandHelper {
  public static setInformation(
    command: ICommand<ICommandContext>,
    information: ICommandInformation
  ): void {
    command.setName(information.name).setDescription(information.description);
  }

  public static registerOption<C>(
    command: ICommand<ICommandContext>,
    option: C
  ): C {
    command.options.push(option as unknown as ToAPIApplicationCommandOptions);
    return option;
  }
}
