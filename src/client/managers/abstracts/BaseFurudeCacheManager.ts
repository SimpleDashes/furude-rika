import { LimitedCapacityCollection } from '../../../modules/framework/collections/LimitedCapacityCollection';
import FurudeRika from '../../FurudeRika';
import BaseFurudeManager from './BaseFurudeManager';
import consola from 'consola';

export class CacheCollection<K, V> extends LimitedCapacityCollection<K, V> {
  private name: string;
  private previousMaxValue: number = 0;

  public constructor(capacity: number, lifetime: number, name: string) {
    super(capacity, lifetime);
    this.name = name;
  }

  override set(key: K, value: V): this {
    super.set(key, value);

    if (this.size == this.previousMaxValue + this.capacity / 10) {
      consola.log(
        `[${this.name.toUpperCase()} CACHE]: reached ${this.size} items.`
      );
    }

    return this;
  }
}

export default abstract class BaseFurudeCacheManager<
  K,
  V
> extends BaseFurudeManager {
  public abstract name(): string;

  public abstract cacheLimit(): number;
  public abstract cacheDuration(): number;

  public readonly collection!: CacheCollection<K, V>;

  public constructor(rika: FurudeRika) {
    super(rika);
    this.collection = new CacheCollection(
      this.cacheLimit(),
      this.cacheDuration(),
      this.name()
    );
  }
}
