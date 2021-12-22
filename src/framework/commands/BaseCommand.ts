import {
  CommandInteraction,
  CacheType,
  Client,
  PermissionResolvable,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import ICommand from './ICommand';
import ICommandInformation from './ICommandInformation';
import CommandHelper from './CommandHelper';
import CommandPrecondition from './preconditions/abstracts/CommandPrecondition';
import PermissionPrecondition from './preconditions/abstracts/PermissionPrecondition';

export default abstract class BaseCommand<T extends Client>
  extends SlashCommandBuilder
  implements ICommand<T, BaseCommand<T>>
{
  public readonly information: ICommandInformation;

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    CommandHelper.setInformation(this, this.information);
  }

  public abstract run(
    client: T,
    interaction: CommandInteraction<CacheType>
  ): Promise<void>;

  public abstract onInsufficientPermissions(
    client: T,
    interaction: CommandInteraction<CacheType>,
    precondition?: PermissionPrecondition,
    missingPermissions?: PermissionResolvable
  ): Promise<void>;

  public registerOption<C>(option: C): C {
    return CommandHelper.registerOption(this, option);
  }
}
