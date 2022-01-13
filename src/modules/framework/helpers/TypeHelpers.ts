export default class TypeHelpers {
  public static isCallback<T>(
    maybeFunction: unknown | ((...args: unknown[]) => T)
  ): maybeFunction is (...args: unknown[]) => T {
    return typeof maybeFunction === 'function';
  }
}
