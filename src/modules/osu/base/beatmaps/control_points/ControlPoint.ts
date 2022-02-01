import type ControlPointGroup from './ControlPointGroup';

export default abstract class ControlPoint {
  /**
   * The time at which the control point takes effect.
   */
  public time!: number;

  public attachGroup(pointGroup: ControlPointGroup): void {
    this.time = pointGroup.time;
  }

  /**
   * Determines whether this {@link ControlPoint} results in a meaningful change when placed alongside another.
   * @param existing An existing control point to compare with.
   * @returns Whether this {@link ControlPoint} is redundant when placed alongside {@link existing}.
   */
  public abstract isRedundant(existing: ControlPoint): boolean;

  public deepClone(): ControlPoint {
    const clone: ControlPoint = new this.constructor.prototype();

    clone.time = this.time;

    return clone;
  }

  public copyFrom(other: ControlPoint): void {
    this.time = other.time;
  }
}
