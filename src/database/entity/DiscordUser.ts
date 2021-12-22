import { Snowflake } from 'discord.js';
import { BaseEntity, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export default class extends BaseEntity {
  @ObjectIdColumn()
  id!: Snowflake;
}
