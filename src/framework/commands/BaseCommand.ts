import {
  CommandInteraction,
  CacheType,
  Client,
  PermissionResolvable,
} from 'discord.js';
import {
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from '@discordjs/builders';
import ICommand from './ICommand';
import ICommandInformation from './ICommandInformation';
import IDiscordOption from '../options/interfaces/IDiscordOption';
import TypeHelpers from '../helpers/TypeHelpers';
import BooleanOption from '../options/classes/BooleanOption';
import ChannelOption from '../options/classes/ChannelOption';
import IntegerOption from '../options/classes/IntegerOption';
import MentionableOptions from '../options/classes/MentionableOption';
import NumberOption from '../options/classes/NumberOption';
import RoleOption from '../options/classes/RoleOption';
import StringOption from '../options/classes/StringOption';
import UserOption from '../options/classes/UserOption';

export default abstract class BaseCommand<T extends Client>
  extends SlashCommandBuilder
  implements ICommand<T>
{
  public readonly argumentOptions: Partial<IDiscordOption<any>>[] = [];
  public readonly information: ICommandInformation;

  public constructor(information: ICommandInformation) {
    super();
    this.information = information;
    this.setName(information.name).setDescription(information.description);
  }

  public abstract run(
    client: T,
    interaction: CommandInteraction<CacheType>
  ): Promise<void>;

  public abstract onInsufficientPermissions(
    client: T,
    interaction: CommandInteraction<CacheType>,
    missingPermissions?: PermissionResolvable
  ): Promise<void>;

  protected registerOption<C>(option: C): C {
    this.argumentOptions.push(option);
    return option;
  }

  private addInternalOption<I>(input: I, isOption: (built: I) => boolean) {
    const built = TypeHelpers.isCallback(input, input) ? input() : input;
    if (isOption(built)) {
      this.argumentOptions.push(built);
    } else {
      throw 'You should use framework classes for handling BaseCommands';
    }
  }

  override addBooleanOption(
    input:
      | SlashCommandBooleanOption
      | ((builder: SlashCommandBooleanOption) => SlashCommandBooleanOption)
  ): Omit<this, 'addSubcommand' | 'addSubcommandGroup'> {
    this.addInternalOption(input, (o) => o instanceof BooleanOption);
    return super.addBooleanOption(input);
  }

  override addChannelOption(
    input:
      | SlashCommandChannelOption
      | ((builder: SlashCommandChannelOption) => SlashCommandChannelOption)
  ): Omit<this, 'addSubcommand' | 'addSubcommandGroup'> {
    this.addInternalOption(input, (o) => o instanceof ChannelOption);
    return super.addChannelOption(input);
  }

  override addIntegerOption(
    input:
      | SlashCommandIntegerOption
      | Omit<SlashCommandIntegerOption, 'setAutocomplete'>
      | Omit<SlashCommandIntegerOption, 'addChoice' | 'addChoices'>
      | ((
          builder: SlashCommandIntegerOption
        ) =>
          | SlashCommandIntegerOption
          | Omit<SlashCommandIntegerOption, 'setAutocomplete'>
          | Omit<SlashCommandIntegerOption, 'addChoice' | 'addChoices'>)
  ): Omit<this, 'addSubcommand' | 'addSubcommandGroup'> {
    this.addInternalOption(input, (o) => o instanceof IntegerOption);
    return super.addIntegerOption(input);
  }

  override addMentionableOption(
    input:
      | SlashCommandMentionableOption
      | ((
          builder: SlashCommandMentionableOption
        ) => SlashCommandMentionableOption)
  ): Omit<this, 'addSubcommand' | 'addSubcommandGroup'> {
    this.addInternalOption(input, (o) => o instanceof MentionableOptions);
    return super.addMentionableOption(input);
  }

  override addNumberOption(
    input:
      | SlashCommandNumberOption
      | Omit<SlashCommandNumberOption, 'setAutocomplete'>
      | Omit<SlashCommandNumberOption, 'addChoice' | 'addChoices'>
      | ((
          builder: SlashCommandNumberOption
        ) =>
          | SlashCommandNumberOption
          | Omit<SlashCommandNumberOption, 'setAutocomplete'>
          | Omit<SlashCommandNumberOption, 'addChoice' | 'addChoices'>)
  ): Omit<this, 'addSubcommand' | 'addSubcommandGroup'> {
    this.addInternalOption(input, (o) => o instanceof NumberOption);
    return super.addNumberOption(input);
  }

  override addRoleOption(
    input:
      | SlashCommandRoleOption
      | ((builder: SlashCommandRoleOption) => SlashCommandRoleOption)
  ): Omit<this, 'addSubcommand' | 'addSubcommandGroup'> {
    this.addInternalOption(input, (o) => o instanceof RoleOption);
    return super.addRoleOption(input);
  }

  override addStringOption(
    input:
      | SlashCommandStringOption
      | Omit<SlashCommandStringOption, 'setAutocomplete'>
      | Omit<SlashCommandStringOption, 'addChoice' | 'addChoices'>
      | ((
          builder: SlashCommandStringOption
        ) =>
          | SlashCommandStringOption
          | Omit<SlashCommandStringOption, 'setAutocomplete'>
          | Omit<SlashCommandStringOption, 'addChoice' | 'addChoices'>)
  ): Omit<this, 'addSubcommand' | 'addSubcommandGroup'> {
    this.addInternalOption(
      input,

      (o) => o instanceof StringOption
    );
    return super.addStringOption(input);
  }

  override addUserOption(
    input:
      | SlashCommandUserOption
      | ((builder: SlashCommandUserOption) => SlashCommandUserOption)
  ): Omit<this, 'addSubcommand' | 'addSubcommandGroup'> {
    this.addInternalOption(input, (o) => o instanceof UserOption);
    return super.addUserOption(input);
  }
}
