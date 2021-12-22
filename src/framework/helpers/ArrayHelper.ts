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
}
