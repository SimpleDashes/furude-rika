class ResourceValue<A extends string = ''> {
  public value: string;

  /**
   * Only used for type safety.
   */
  public args: A[] = [];

  public constructor(value: string) {
    this.value = value;
  }
}

export default ResourceValue;
