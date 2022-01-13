import type { BaseEntity, Repository } from 'typeorm';
import type Constructor from '../../modules/framework/interfaces/Constructor';

type ClassRepository<T extends BaseEntity> = Omit<
  Repository<T>,
  | 'recover'
  | 'reload'
  | 'manager'
  | 'metadata'
  | 'softDelete'
  | 'restore'
  | 'increment'
  | 'decrement'
> &
  Constructor<[], T>;

export type { ClassRepository };
