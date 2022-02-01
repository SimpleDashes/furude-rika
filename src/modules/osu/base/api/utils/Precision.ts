/**
 * Utility class to compare float values for equality.
 */
export default class Precision {
  /**
   * The default epsilon for all float values.
   */
  public static FLOAT_EPSILON = 1e-3;

  public static definitelyBigger(
    value1: number,
    value2: number,
    acceptableDifference = this.FLOAT_EPSILON
  ): boolean {
    return value1 - acceptableDifference > value2;
  }

  public static almostBigger(
    value1: number,
    value2: number,
    acceptableDifference = this.FLOAT_EPSILON
  ): boolean {
    return value1 > value2 - acceptableDifference;
  }

  public static almostEquals(
    value1: number,
    value2: number,
    acceptableDifference = this.FLOAT_EPSILON
  ): boolean {
    return Math.abs(value1 - value2) <= acceptableDifference;
  }
}
