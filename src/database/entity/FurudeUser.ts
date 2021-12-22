import { Snowflake } from 'discord.js';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';
import SupportedFurudeLocales from '../../localization/SupportedFurudeLocales';

@Entity()
export class FurudeUser extends BaseEntity {
  @ObjectIdColumn()
  id!: Snowflake;

  @Column()
  preferred_locale?: SupportedFurudeLocales;
}
