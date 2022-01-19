import { assertDefinedGet } from 'discowork/src/assertions';
import type ResourceValue from 'discowork/src/localization/resources/ResourceValue';
import type FurudeLocalizer from '../../../localization/FurudeLocalizer';
import type { FurudeLanguages } from '../../../localization/FurudeLocalizer';
import type FurudeResourceStructure from '../../../localization/FurudeResourceStructure';
import FurudeOperations from '../../FurudeOperations';
import type IDatabaseOperation from '../../interfaces/IDatabaseOperation';
import type IHasPreferredLocale from '../../interfaces/IHasPreferredLocale';

export default class EntityWithLocaleHelper {
  public static setPreferredLocale<T extends IHasPreferredLocale>(
    that: T,
    localizer: FurudeLocalizer,
    locale: FurudeLanguages | undefined,
    keyIfPresent: (key: FurudeResourceStructure) => ResourceValue,
    keyElse?: (key: FurudeResourceStructure) => ResourceValue
  ): IDatabaseOperation {
    that.preferred_locale = locale;

    const response = localizer.getTranslation(
      locale,
      locale ? keyIfPresent : assertDefinedGet(keyElse),
      {}
    );

    return FurudeOperations.success(response);
  }
}
