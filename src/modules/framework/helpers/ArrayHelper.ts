export default class ArrayHelper {
  public static getRandomArrayElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)] as T;
  }

  public static pushToArrayIfItExistsElseCreateArray<T>(
    possibleArray: null | undefined | T[],
    object: T
  ) {
    if (!possibleArray) {
      possibleArray = [];
    }
    possibleArray.push(object);
    return possibleArray;
  }

  private static applyDeterministicFieldSort<T>(
    item: T,
    deterministicField?: (item: T) => any
  ): any {
    return deterministicField ? deterministicField(item) : item;
  }

  /**
   *
   * @param array The array to be sorted.
   * @param deterministicField Function which should return from which field the array should be sorted on.
   * @returns The sorted array;
   */
  public static greatestToLowest<T>(
    array: T[],
    deterministicField?: (item: T) => any
  ): T[] {
    return array.sort(
      (a, b) =>
        this.applyDeterministicFieldSort(b, deterministicField) -
        this.applyDeterministicFieldSort(a, deterministicField)
    );
  }

  /**
   *
   * @param array The array to be sorted.
   * @param deterministicField Function which should return from which field the array should be sorted on.
   * @returns The sorted array;
   */
  public static lowestToGreatest<T>(
    array: T[],
    deterministicField?: (item: T) => any
  ): T[] {
    return array.sort(
      (a, b) =>
        this.applyDeterministicFieldSort(a, deterministicField) -
        this.applyDeterministicFieldSort(b, deterministicField)
    );
  }
}
