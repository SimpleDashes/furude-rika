/**
 * Represents a database operation
 */
export default interface IDatabaseOperation {
  /**
   *  Wether said operation was achieved successfully or not.
   */
  readonly successfully: boolean;

  /**
   * @returns The response with information about said operation.
   */
  readonly response: string;
}
