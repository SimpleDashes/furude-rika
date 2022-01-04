import { Column, Entity } from 'typeorm';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import IDatabaseOperation from '../interfaces/IDatabaseOperation';
import IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';
import EntityWithLocaleHelper from './helpers/EntityWithLocaleHelper';

@Entity()
export default class DBChannel
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  @Column()
  preferred_locale?: SupportedFurudeLocales | undefined | null;

  setPreferredLocale(
    localizer: FurudeLocales,
    locale: SupportedFurudeLocales | null | undefined
  ): IDatabaseOperation {
    return EntityWithLocaleHelper.setPreferredLocale(
      this,
      localizer,
      locale,
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_CHANNEL,
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_CHANNEL_ANY
    );
  }
}
