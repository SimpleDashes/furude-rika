import { SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import CommandHelper from './CommandHelper';
import type ICommandInformation from './interfaces/ICommandInformation';

export default abstract class SubCommandGroup extends SlashCommandSubcommandGroupBuilder {
  public readonly information: ICommandInformation;

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    CommandHelper.setInformation(this, this.information);
  }
}
