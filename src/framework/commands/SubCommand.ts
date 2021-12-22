import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction, CacheType } from 'discord.js';
import BaseBot from '../client/BaseBot';
import CommandHelper from './CommandHelper';
import ICommand from './interfaces/ICommand';
import ICommandInformation from './interfaces/ICommandInformation';
import IRunsCommand from './interfaces/IRunsCommand';

export default abstract class SubCommand<T extends BaseBot>
  extends SlashCommandSubcommandBuilder
  implements ICommand<T, SubCommand<T>>
{
  public readonly information: ICommandInformation;
  public readonly runners: IRunsCommand<T>[] = [];

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    CommandHelper.setInformation(this, this.information);
  }

  public abstract createRunner(
    interaction: CommandInteraction<CacheType>
  ): IRunsCommand<T>;

  public registerOption<C>(option: C): C {
    return CommandHelper.registerOption(this, option);
  }
}
