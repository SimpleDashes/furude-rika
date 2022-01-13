import { BaseEntity, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export default abstract class GeneratedIDEntity extends BaseEntity {
  @ObjectIdColumn({ generated: true })
  public _id!: number;
}
