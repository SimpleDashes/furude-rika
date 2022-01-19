import type FurudeResourceStructure from './FurudeResourceStructure';
import FurudeResource from './FurudeResource';
import Localizer from 'discowork/src/localization/Localizer';
import Locale from 'discowork/src/localization/Locale';
import type ResourceValue from 'discowork/src/localization/resources/ResourceValue';
import path from 'path';
import ClassLoader from 'discowork/src/io/loaders/ClassLoader';
import Directory from 'discowork/src/io/directories/Directory';
import type DefaultContext from '../contexts/DefaultContext';

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
