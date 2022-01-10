import { BaseEntity, Repository } from 'typeorm';
import Constructor from '../../modules/framework/interfaces/Constructor';

type TClassRepository<T extends BaseEntity> = Omit<
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

export default TClassRepository;
