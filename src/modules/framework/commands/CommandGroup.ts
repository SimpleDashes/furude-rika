import { SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType } from 'discord.js';
import BaseBot from '../client/BaseBot';
import CommandHelper from './CommandHelper';
import ICommand from './interfaces/ICommand';
import ICommandInformation from './interfaces/ICommandInformation';
import IRunsCommand from './interfaces/IRunsCommand';

export default abstract class CommandGroup<T extends BaseBot>
  extends SlashCommandSubcommandGroupBuilder
  implements ICommand<T, CommandGroup<T>>
{
  public readonly information: ICommandInformation;

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    CommandHelper.setInformation(this, this.information);
  }

  public abstract createRunner(
    interaction: CommandInteraction<CacheType>
  ): Promise<IRunsCommand<T>>;

  public registerOption<C>(option: C): C {
    return CommandHelper.registerOption(this, option);
  }
}
