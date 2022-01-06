export default class Numbers {
  /**
   *
   * @param number The optional number.
   * @returns The number or 0 if the number doesn't exist.
   */
  public static defaultOptionalNumber(
    number?: number | undefined | null
  ): number {
    return number ?? 0;
  }
}
