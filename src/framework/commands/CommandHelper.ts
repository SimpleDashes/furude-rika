import { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import ICommand from './ICommand';
import ICommandInformation from './ICommandInformation';

export default class CommandHelper {
  public static setInformation(
    command: ICommand<any, any>,
    information: ICommandInformation
  ) {
    command.setName(information.name).setDescription(information.description);
  }

  public static registerOption<C>(command: ICommand<any, any>, option: C): C {
    command.options.push(option as unknown as ToAPIApplicationCommandOptions);
    return option;
  }
}
