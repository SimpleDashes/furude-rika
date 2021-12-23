import { Snowflake } from 'discord.js';
import { BaseEntity, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export default class SnowFlakeIDEntity extends BaseEntity {
  @ObjectIdColumn()
  id!: Snowflake;
}
