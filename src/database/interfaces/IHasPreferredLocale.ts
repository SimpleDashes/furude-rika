import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';

export default interface IHasPreferredLocale {
  preferred_locale?: SupportedFurudeLocales | undefined | null;
}
