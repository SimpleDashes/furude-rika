import type { ConstructorType } from 'discowork';
import type { BaseEntity, Repository } from 'typeorm';

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
  ConstructorType<[], T>;

export type { ClassRepository };
