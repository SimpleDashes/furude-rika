import type { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import type ICommand from './interfaces/ICommand';
import type ICommandContext from './contexts/ICommandContext';
import type ICommandInformation from './interfaces/ICommandInformation';
import type { TypedArgs } from './decorators/ContextDecorators';

export default class CommandHelper {
  public static setInformation(
    command: {
      setName: (name: string) => unknown;
      setDescription: (description: string) => unknown;
    },
    information: ICommandInformation
  ): void {
    command.setName(information.name);
    command.setDescription(information.description);
  }

  public static registerOption<
    CTX extends ICommandContext<TypedArgs<unknown>>,
    O
  >(command: ICommand<CTX, unknown>, option: O): O {
    command.options.push(option as unknown as ToAPIApplicationCommandOptions);
    return option;
  }
}
