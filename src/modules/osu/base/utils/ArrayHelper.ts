import type { ConstructorType } from 'discowork';

export default class ArrayHelper {
  /**
   * Filters an array with the corresponding type.
   */
  public static ofType<T, S extends T>(
    array: T[],
    type: ConstructorType<unknown[], S>
  ): S[] {
    return array.filter((o) => o instanceof type) as S[];
  }
}
