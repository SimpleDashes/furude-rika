import type ILocalizerResource from '../modules/framework/localization/v1/ILocalizerResource';
import type IFurudeResource from './IFurudeResource';
import type SupportedFurudeLocales from './SupportedFurudeLocales';

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
