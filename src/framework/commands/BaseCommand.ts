import { CommandInteraction, CacheType } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import ICommand from './interfaces/ICommand';
import ICommandInformation from './interfaces/ICommandInformation';
import CommandHelper from './CommandHelper';
import IRunsCommand from './interfaces/IRunsCommand';
import BaseBot from '../client/BaseBot';

export default abstract class BaseCommand<T extends BaseBot>
  extends SlashCommandBuilder
  implements ICommand<T, BaseCommand<T>>
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
