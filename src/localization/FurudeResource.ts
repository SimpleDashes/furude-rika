import ILocalizerResource from '../framework/localization/ILocalizerResource';
import IFurudeResource from './IFurudeResource';
import SupportedFurudeLocales from './SupportedFurudeLocales';

export default class FurudeResource
  implements ILocalizerResource<IFurudeResource>
{
  public readonly furudeLocale: SupportedFurudeLocales;
  public readonly locale: string;
  public readonly structure: IFurudeResource;

  public constructor(
    locale: SupportedFurudeLocales,
    structure: IFurudeResource
  ) {
    this.furudeLocale = locale;
    this.locale = locale;
    this.structure = structure;
  }
}
