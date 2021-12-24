import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';
import IHasPreferredLocale from '../interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';
import DBCitizen from './DBCitizen';

/**
 * This class contains general information
 * Retained on the database related to a said user
 */
@Entity()
export default class DBUser
  extends SnowFlakeIDEntity
  implements IHasPreferredLocale
{
  @Column()
  preferred_locale?: SupportedFurudeLocales | undefined | null;

  @OneToOne((_type) => DBCitizen, { cascade: true })
  @JoinColumn()
  citizen!: DBCitizen;
}
