import type { Collection } from 'discord.js';
import { assertDefined } from 'discowork';

export default class CollectionUtils {
  public static collectionToRecord<K extends string | number | symbol, T>(
    collection: Collection<K, T>
  ): Record<K, T> {
    const record = {};
    const tRecord = record as Record<K, T>;
    for (const k of collection.keys()) {
      const value = collection.get(k);
      assertDefined(value);
      tRecord[k] = value;
    }
    return tRecord;
  }
}
