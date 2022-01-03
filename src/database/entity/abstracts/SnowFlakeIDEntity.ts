import { Snowflake } from 'discord.js';
import {
  BaseEntity,
  Column,
  Entity,
  ObjectIdColumn,
  SaveOptions,
} from 'typeorm';

@Entity()
export default class SnowFlakeIDEntity
  extends BaseEntity
  implements IHasJustCreatedIdentifier
{
  @ObjectIdColumn()
  id!: Snowflake;

  @Column({ update: false, nullable: true, type: 'bool' })
  justCreated: boolean | null = null;

  override async save(options?: SaveOptions): Promise<this> {
    this.justCreated = null;
    return await super.save(options);
  }
}
