import ILocalizerResource from '../framework/localization/ILocalizerResource';
import IFurudeLocale from './IFurudeTranslation';
import SupportedFurudeLocales from './SupportedFurudeLocales';

export default class FurudeResource
  implements ILocalizerResource<IFurudeLocale>
{
  public readonly furudeLocale: SupportedFurudeLocales;
  public readonly locale: string;
  public readonly structure: IFurudeLocale;

  public constructor(locale: SupportedFurudeLocales, structure: IFurudeLocale) {
    this.furudeLocale = locale;
    this.locale = locale;
    this.structure = structure;
  }
}
