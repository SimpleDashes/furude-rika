import Event from '../../events/Event';
import ControlPoint from './ControlPoint';

export default class ControlPointGroup {
  public readonly itemAdded = new Event<[ControlPoint]>();
  public readonly itemRemoved = new Event<[ControlPoint]>();

  /**
   * The time at which the control point takes effect.
   */
  public readonly time: number;

  private controlPoints: ControlPoint[] = [];

  public get ControlPoints(): ControlPoint[] {
    return this.controlPoints;
  }

  public constructor(time: number) {
    this.time = time;
  }

  public add(...points: ControlPoint[]): void {
    points.forEach((point) => {
      const existing = this.controlPoints.filter(
        (p) => p.constructor.prototype === point.constructor.prototype
      )[0];

      if (existing) {
        this.remove(existing);
      }

      point.attachGroup(this);

      this.controlPoints.push(point);
      this.itemAdded.invoke(point);
    });
  }

  public remove(...points: ControlPoint[]): void {
    points
      .map((p) => this.controlPoints.indexOf(p))
      .forEach((i) => {
        if (i === -1) {
          throw `${ControlPoint.name} to remove not present on this ${ControlPointGroup.name} instance.`;
        }
        this.controlPoints.splice(i, 1);
      });
  }
}
