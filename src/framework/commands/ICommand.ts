import { ToAPIApplicationCommandOptions } from '@discordjs/builders';
import { Client, CommandInteraction, PermissionResolvable } from 'discord.js';
import ICommandInformation from './ICommandInformation';

export default interface ICommand<
  T extends Client,
  THIS extends ICommand<T, THIS>
> {
  readonly options: ToAPIApplicationCommandOptions[];
  readonly information: ICommandInformation;
  run(client: T, interaction: CommandInteraction): Promise<void>;
  onInsufficientPermissions(
    client: T,
    interaction: CommandInteraction,
    missingPermissions?: PermissionResolvable
  ): Promise<void>;
  registerOption<C>(option: C): C;
  setName(name: string): THIS;
  setDescription(description: string): THIS;
}
