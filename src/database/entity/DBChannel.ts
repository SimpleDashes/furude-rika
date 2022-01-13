import { Column, Entity } from 'typeorm';
import type FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import type SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import type IDatabaseOperation from '../interfaces/IDatabaseOperation';
import type IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';
import EntityWithLocaleHelper from './helpers/EntityWithLocaleHelper';

@Entity()
export default class DBChannel
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  @Column()
  public preferred_locale?: SupportedFurudeLocales | undefined;

  public setPreferredLocale(
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
