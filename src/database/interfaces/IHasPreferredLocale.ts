import type FurudeLocales from '../../localization/FurudeLocales';
import type SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import type IDatabaseOperation from './IDatabaseOperation';

export default interface IHasPreferredLocale {
  preferred_locale?: SupportedFurudeLocales | undefined | null;

  setPreferredLocale: (
    localizer: FurudeLocales,
    locale: SupportedFurudeLocales | undefined | null
  ) => IDatabaseOperation;
}
