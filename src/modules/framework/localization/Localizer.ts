import i18next, { Resource } from 'i18next';
import ILocalizerResource from './ILocalizerResource';

export default class Localizer<I> {
  public readonly defaultLocale: string;
  public readonly locales: ILocalizerResource<I>[];

  protected constructor(options: {
    defaultLocale: string;
    locales: ILocalizerResource<I>[];
  }) {
    this.defaultLocale = options.defaultLocale;
    this.locales = options.locales;
  }

  protected async onReady(): Promise<void> {
    const foundDefaultLocale = this.locales.find(
      (locale) => locale.locale === this.defaultLocale
    );

    if (!foundDefaultLocale) {
      throw `locales should include the defaultLocale`;
    }

    const resources: Record<string, I> = {};

    this.locales.forEach((locale) => {
      resources[locale.locale] = locale.structure;
    });

    await i18next.init({
      lng: this.defaultLocale,
      resources: resources as unknown as Resource,
    });
  }
}
