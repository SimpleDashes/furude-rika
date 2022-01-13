import type FurudeLocales from '../../../localization/FurudeLocales';
import type FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import type SupportedFurudeLocales from '../../../localization/SupportedFurudeLocales';
import FurudeOperations from '../../FurudeOperations';
import type IDatabaseOperation from '../../interfaces/IDatabaseOperation';
import type IHasPreferredLocale from '../../interfaces/IHasPreferredLocale';

export default class EntityWithLocaleHelper {
  public static setPreferredLocale<T extends IHasPreferredLocale>(
    that: T,
    localizer: FurudeLocales,
    locale: SupportedFurudeLocales | null | undefined,
    keyIfPresent: FurudeTranslationKeys,
    keyElse?: FurudeTranslationKeys
  ): IDatabaseOperation {
    that.preferred_locale = locale;
    let response = '';
    if (locale) {
      response = localizer.get(keyIfPresent);
    } else if (keyElse) {
      response = localizer.get(keyElse);
    }
    return FurudeOperations.success(response);
  }
}
