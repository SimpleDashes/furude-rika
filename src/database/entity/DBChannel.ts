import { Entity, Column } from 'typeorm';
import type FurudeLocalizer from '../../localization/FurudeLocalizer';
import type { FurudeLanguages } from '../../localization/FurudeLocalizer';
import type IDatabaseOperation from '../interfaces/IDatabaseOperation';
import type IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';
import EntityWithLocaleHelper from './helpers/EntityWithLocaleHelper';

@Entity()
export default class DBChannel
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  @Column('string', { nullable: true })
  public preferred_locale?: FurudeLanguages | undefined;

  public setPreferredLocale(
    localizer: FurudeLocalizer,
    locale: FurudeLanguages | undefined
  ): IDatabaseOperation {
    return EntityWithLocaleHelper.setPreferredLocale(
      this,
      localizer,
      locale,
      (k) => k.customize.locale.channel.responses.default,
      (k) => k.customize.locale.channel.responses.any
    );
  }
}
