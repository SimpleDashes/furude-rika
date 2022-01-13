import type { BaseEntity } from 'typeorm';

/**
 * Extensions are used to store multiple objects or functions
 * which aren't that much related to the base entity or
 * aren't supposed to be persisted on the database, we use then
 * so the database isn't filled with lots of useless "null" values.
 */
export default abstract class EntityExtension<T extends BaseEntity> {
  protected base: T;

  public constructor(base: T) {
    this.base = base;
  }
}
