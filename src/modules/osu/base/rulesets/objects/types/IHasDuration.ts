/**
 * A HitObject that ends at a different time than its start time.
 */
export default interface IHasDuration {
  /**
   * The time at which the HitObject ends.
   */
  endTime: number;

  /**
   * The duration of the HitObject.
   */
  duration: number;
}
