import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export default abstract class GeneratedIDEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: unknown;
}
