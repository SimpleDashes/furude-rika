import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import {
  CacheType,
  Client,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js';
import CommandHelper from './CommandHelper';
import ICommand from './ICommand';
import ICommandInformation from './ICommandInformation';
import CommandPrecondition from './preconditions/abstracts/CommandPrecondition';

export default abstract class SubCommand<T extends Client>
  extends SlashCommandSubcommandBuilder
  implements ICommand<T, SubCommand<T>>
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
    precondition: CommandPrecondition,
    missingPermissions?: PermissionResolvable
  ): Promise<void>;

  public abstract onMissingRequiredSubCommands(
    client: T,
    interaction: CommandInteraction<CacheType>
  ): Promise<void>;

  public registerOption<C>(option: C): C {
    return CommandHelper.registerOption(this, option);
  }
}
