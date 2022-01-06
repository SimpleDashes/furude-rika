export default class TypeHelpers {
  private constructor() {}

  public static isCallback<T>(
    maybeFunction: any | ((...args: any[]) => T),
    _returnType?: T
  ): maybeFunction is (...args: any[]) => T {
    return typeof maybeFunction === 'function';
  }
}
