export default abstract class ManagesInternalArray<T> {
  protected internalArray: T[] = [];

  public get InternalArray(): T[] {
    return this.internalArray;
  }

  /**
   * Pushes and gets an item on a array useful for initializing classes
   *  which depends on these objects
   * @param item Item to be pushed
   * @returns said item
   */
  protected pushGet(item: T): T {
    this.internalArray.push(item);
    return item;
  }
}
