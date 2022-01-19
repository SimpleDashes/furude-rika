import type DefaultContext from '../../../contexts/DefaultContext';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import type IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import type SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';
import FurudeOperations from '../../../database/FurudeOperations';
import type { FurudeLanguages } from '../../../localization/FurudeLocalizer';
import FurudeLocalizer, {
  FurudeLanguagesArray,
} from '../../../localization/FurudeLocalizer';
import StringOption from 'discowork/src/options/classes/StringOption';

export type BaseLanguageChangeArgs = {
  locale: Omit<StringOption, 'setAutocomplete'>;
};

export default abstract class CustomizesLocaleSubCommand extends FurudeSubCommand<
  BaseLanguageChangeArgs,
  DefaultContext<BaseLanguageChangeArgs>
> {
  protected static readonly LOCALE_NAME = 'language';

  public createArguments(): BaseLanguageChangeArgs {
    return {
      locale: new StringOption()
        .setRequired(true)
        .setName(CustomizesLocaleSubCommand.LOCALE_NAME)
        .addChoices(this.getAllFurudeLocales()),
    };
  }

  protected getAllFurudeLocales(): [name: string, value: string][] {
    return FurudeLanguagesArray.map((l) => [l, l]);
  }

  public async trigger(
    context: DefaultContext<BaseLanguageChangeArgs>
  ): Promise<void> {
    const { interaction, args, client } = context;
    const { localizer } = client;
    const { locale } = args;

    const preferredLocale = locale
      ? ((): FurudeLanguages => {
          return (
            FurudeLanguagesArray.find(
              (l) => l === (locale as unknown as string as FurudeLanguages)
            ) ?? FurudeLocalizer.defaultLocale
          );
        })()
      : undefined;

    const entityToLocalize = this.entityToLocalize(context);

    const operation = entityToLocalize.setPreferredLocale(
      localizer,
      preferredLocale
    );

    await entityToLocalize.save();
    await FurudeOperations.answerInteraction(interaction, operation);
  }

  public abstract entityToLocalize(
    context: DefaultContext<BaseLanguageChangeArgs>
  ): IHasPreferredLocale & SnowFlakeIDEntity;
}
