import { Collection } from 'discord.js';

export default class CollectionHelper {
  public static collectionToRecord<K extends string | number | symbol, T>(
    collection: Collection<K, T>
  ) {
    const record = {};
    const tRecord = record as Record<K, T>;
    for (const k of collection.keys()) {
      tRecord[k] = collection.get(k)!;
    }
    return tRecord;
  }
}
