import DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import StringOption from '../../../modules/framework/options/classes/StringOption';
import SupportedFurudeLocales from '../../../localization/SupportedFurudeLocales';
import IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';
import FurudeOperations from '../../../database/FurudeOperations';

export default abstract class CustomizesLocaleSubCommand extends FurudeSubCommand {
  protected abstract readonly localeOption: StringOption;

  protected static readonly LOCALE_NAME = 'language';

  protected getAllFurudeLocales(): [name: string, value: string][] {
    return Object.keys(SupportedFurudeLocales).map((l) => [l, l]);
  }

  protected getLocaleOption() {
    return new StringOption()
      .setRequired(true)
      .setName(CustomizesLocaleSubCommand.LOCALE_NAME)
      .addChoices(this.getAllFurudeLocales());
  }

  public constructor(description: string) {
    super({
      name: CustomizesLocaleSubCommand.LOCALE_NAME,
      description,
    });
  }

  public async trigger(context: DefaultContext): Promise<void> {
    const { interaction, localizer } = context;

    const preferredLocale =
      SupportedFurudeLocales[
        this.localeOption.apply(interaction)! as SupportedFurudeLocales
      ] ?? null;

    const entityToLocalize = this.entityToLocalize(context);

    const operation = entityToLocalize.setPreferredLocale(
      localizer,
      preferredLocale
    );

    await entityToLocalize.save();
    await FurudeOperations.answerInteraction(interaction, operation);
  }

  public abstract entityToLocalize(
    context: DefaultContext
  ): IHasPreferredLocale & SnowFlakeIDEntity;
}
