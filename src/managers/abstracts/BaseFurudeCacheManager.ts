import type FurudeRika from '../../client/FurudeRika';
import BaseFurudeManager from './BaseFurudeManager';
import { LimitedCapacityCollection, Logger } from 'discowork';

export class CacheCollection<K, V> extends LimitedCapacityCollection<K, V> {
  public readonly name: string;
  #logPercentIncrease;
  #previousLogSize = 0;

  /**
   *
   * @param capacity The capacity of the cache collection.
   * @param lifetime How long the items will be cached. In seconds.
   * @param name The name of the cache. used for logging.
   * @param logPercentIncrease The percent used to log when the size of the cache
   *  increases by said percent related to the max cache capacity.
   */
  public constructor(
    capacity: number,
    lifetime: number,
    name: string,
    logPercentIncrease = 10
  ) {
    super(capacity, lifetime);
    this.name = name;
    this.#logPercentIncrease = logPercentIncrease;
  }

  public override set(key: K, value: V): this {
    super.set(key, value);

    if (
      this.size ==
      this.#previousLogSize + this.capacity / this.#logPercentIncrease
    ) {
      this.#previousLogSize = this.size;
      Logger.log(
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
