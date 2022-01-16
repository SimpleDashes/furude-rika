import type DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import StringOption from '../../../modules/framework/options/classes/StringOption';
import type IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import type SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';
import FurudeOperations from '../../../database/FurudeOperations';
import type { TypedArgs } from '../../../modules/framework/commands/contexts/types';
import type { FurudeLanguages } from '../../../localization/FurudeLocalizer';
import FurudeLocalizer, {
  FurudeLanguagesArray,
} from '../../../localization/FurudeLocalizer';

export type BaseLanguageChangeArgs = {
  locale: Omit<StringOption, 'setAutocomplete'>;
};
export default abstract class CustomizesLocaleSubCommand extends FurudeSubCommand<
  DefaultContext<TypedArgs<BaseLanguageChangeArgs>>,
  BaseLanguageChangeArgs
> {
  protected static readonly LOCALE_NAME = 'language';

  public createArgs(): BaseLanguageChangeArgs {
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

  public constructor(description: string) {
    super({
      name: CustomizesLocaleSubCommand.LOCALE_NAME,
      description,
    });
  }

  public async trigger(
    context: DefaultContext<TypedArgs<BaseLanguageChangeArgs>>
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
    context: DefaultContext<TypedArgs<BaseLanguageChangeArgs>>
  ): IHasPreferredLocale & SnowFlakeIDEntity;
}
