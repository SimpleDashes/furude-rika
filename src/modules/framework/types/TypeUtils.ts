export default class TypeUtils {
  /**
   * Utility function to create a K:V from a list of strings
   * @param o An array.
   * @returns An null object. since you only need the typeof it.
   */
  public static strEnum<T extends string, V extends string>(
    o: Array<T>
  ): { [K in T]: K extends V ? V : K } {
    return o.reduce((res, key) => {
      res[key] = key;
      return res;
    }, Object.create(null));
  }
}
