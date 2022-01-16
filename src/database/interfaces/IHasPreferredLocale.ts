import type FurudeLocalizer from '../../localization/FurudeLocalizer';
import type { FurudeLanguages } from '../../localization/FurudeLocalizer';
import type IDatabaseOperation from './IDatabaseOperation';

export default interface IHasPreferredLocale {
  preferred_locale?: FurudeLanguages | undefined;

  setPreferredLocale: (
    localizer: FurudeLocalizer,
    locale: FurudeLanguages | undefined
  ) => IDatabaseOperation;
}
