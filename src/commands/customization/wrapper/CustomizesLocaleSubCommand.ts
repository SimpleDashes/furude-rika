import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import StringOption from '../../../framework/options/classes/StringOption';

export default abstract class CustomizesLocaleSubCommand extends FurudeSubCommand {
  protected anyLocale = 'any';

  public abstract locale: StringOption;
}
