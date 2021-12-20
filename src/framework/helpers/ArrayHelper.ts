export default class ArrayHelper {
  public static getRandomArrayElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)] as T;
  }
}
