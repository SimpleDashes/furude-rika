import ResourceResolver from './ResourceResolver';
import DirectoryMapper from '../modules/framework/io/DirectoryMapper';
import path from 'path';
import type DefaultContext from '../client/contexts/DefaultContext';
import Localizer from '../modules/framework/localization/Localizer';
import Locale from '../modules/framework/localization/Locale';
import type ResourceValue from '../modules/framework/localization/resources/ResourceValue';
import type FurudeResourceStructure from './FurudeResourceStructure';
import type FurudeResource from './FurudeResource';

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

  static #resourceResolver = new ResourceResolver(
    new DirectoryMapper(path.join(__dirname, 'resources'))
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
