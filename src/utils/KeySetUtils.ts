import type IKeyValueSet from '../discord/interfaces/IKeyValueSet';

export default class KeySetUtils {
  public static getObject<K, V>(
    array: IKeyValueSet<K, V>[],
    key: K
  ): IKeyValueSet<K, V> | undefined {
    return array.find((o) => o.key === key);
  }

  public static getValue<K, V>(
    array: IKeyValueSet<K, V>[],
    key: K
  ): V | undefined {
    return this.getObject(array, key)?.value;
  }

  public static setValue<K, V>(
    array: IKeyValueSet<K, V>[],
    key: K,
    value: V
  ): void {
    const current = this.getObject(array, key);
    if (current) {
      current.value = value;
    } else {
      array.push({ key, value });
    }
  }
}
