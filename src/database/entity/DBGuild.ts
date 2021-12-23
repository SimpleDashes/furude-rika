import { Column, Entity } from 'typeorm';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';

@Entity()
export default class DBGuild
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  @Column()
  preferred_locale?: SupportedFurudeLocales | undefined | null;
}
