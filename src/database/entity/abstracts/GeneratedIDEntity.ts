import { Entity, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default abstract class GeneratedIDEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: unknown;
}
