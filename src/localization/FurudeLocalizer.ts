import type { ResourceValue } from 'discowork';
import { Locale, ClassLoader, Directory } from 'discowork';
import Localizer from 'discowork/lib/localization/Localizer';
import path from 'path';
import type DefaultContext from '../contexts/DefaultContext';
import FurudeResource from './FurudeResource';
import type FurudeResourceStructure from './FurudeResourceStructure';

export type FurudeLanguages = Locale.pt_BR | Locale.en;

export const FurudeLanguagesArray: FurudeLanguages[] = [
  Locale.pt_BR,
  Locale.en,
];

export default class FurudeLocalizer extends Localizer<
  FurudeLanguages,
  FurudeResourceStructure,
  FurudeResource
> {
  public static defaultLocale: FurudeLanguages = Locale.en;

  static #resourceResolver = new ClassLoader(
    FurudeResource,
    new Directory(path.join(__dirname, 'resources'))
  );

  public constructor() {
    super(FurudeLocalizer.defaultLocale, FurudeLocalizer.#resourceResolver);
  }

  public getLanguageFromContext(
    context: DefaultContext<unknown>
  ): FurudeLanguages {
    return context
      ? context.dbGuild?.preferred_locale ??
          context.dbChannel?.preferred_locale ??
          context.dbGuild?.preferred_locale ??
          context.dbUser.preferred_locale ??
          FurudeLocalizer.defaultLocale
      : FurudeLocalizer.defaultLocale;
  }

  public getTranslationFromContext<
    A extends string,
    K extends ResourceValue<A>
  >(
    context: DefaultContext<unknown>,
    key: (structure: FurudeResourceStructure) => K,
    placeholders: { [K in A]: K extends string ? string : K },
    language = this.getLanguageFromContext(context)
  ): string {
    return super.getTranslation(language, key, placeholders);
  }
}
