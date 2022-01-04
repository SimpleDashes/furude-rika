import FurudeLocales from '../../localization/FurudeLocales';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import IDatabaseOperation from './IDatabaseOperation';

export default interface IHasPreferredLocale {
  preferred_locale?: SupportedFurudeLocales | undefined | null;

  setPreferredLocale(
    localizer: FurudeLocales,
    locale: SupportedFurudeLocales | undefined | null
  ): IDatabaseOperation;
}
