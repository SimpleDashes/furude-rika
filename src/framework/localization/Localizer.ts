import i18next, { Resource } from 'i18next';
import ILocalizerStructure from './ILocalizerStructure';
import ILocalizerResource from './ILocalizerResource';

export default class Localizer<I extends ILocalizerStructure> {
  public readonly defaultLocale: string;
  public readonly locales: ILocalizerResource<I>[];

  protected constructor(options: {
    defaultLocale: string;
    locales: ILocalizerResource<I>[];
  }) {
    this.defaultLocale = options.defaultLocale;
    this.locales = options.locales;
  }

  protected onReady() {
    const foundDefaultLocale = this.locales.find(
      (locale) => locale.locale == this.defaultLocale
    );

    if (!foundDefaultLocale) {
      throw `locales should include the defaultLocale`;
    }

    const resources: Record<string, ILocalizerStructure> = {};

    this.locales.forEach((locale) => {
      resources[locale.locale] = locale.structure;
    });

    i18next.init({
      lng: this.defaultLocale,
      resources: resources as Resource,
    });
  }
}
