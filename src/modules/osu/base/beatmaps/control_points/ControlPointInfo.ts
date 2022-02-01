import BindableBeatDivisor from '../../editor/BindableBeatDivisor';
import Precision from '../../api/utils/Precision';
import type ControlPoint from './ControlPoint';
import ControlPointGroup from './ControlPointGroup';
import EffectControlPoint from './EffectControlPoint';
import TimingControlPoint from './TimingControlPoint';

export default class ControlPointInfo {
  public readonly groups: ControlPointGroup[] = [];

  public readonly timingPoints: TimingControlPoint[] = [];

  public readonly effectPoints: EffectControlPoint[] = [];

  public allControlPoints(): ControlPoint[] {
    return this.groups.map((g) => g.ControlPoints).flat();
  }

  #pointAt<T extends ControlPoint>(
    list: T[],
    time: number,
    defaultValue: T
  ): T {
    return list.find((p) => p.time === time) ?? defaultValue;
  }

  public effectPointAt(time: number): EffectControlPoint {
    return this.#pointAt(this.effectPoints, time, EffectControlPoint.DEFAULT);
  }

  public timingPointAt(time: number): TimingControlPoint {
    return this.#pointAt(
      this.timingPoints,
      time,
      this.timingPoints[0] ?? TimingControlPoint.DEFAULT
    );
  }

  public removeGroup(group: ControlPointGroup): void {
    group.remove(...group.ControlPoints);

    group.itemAdded.removeListener(this.groupItemAdded);
    group.itemRemoved.removeListener(this.groupItemRemoved);

    const index = this.groups.indexOf(group);
    if (index === -1) {
      throw `${ControlPointGroup.name} to be removed not found.`;
    }

    this.groups.splice(index, 1);
  }

  public getClosestSnappedTime(
    time: number,
    beatDivisor: number,
    referenceTime = time
  ): number {
    const timingPoint = this.timingPointAt(referenceTime);
    return this.getClosestSnappedTimeByTimingPoint(
      timingPoint,
      time,
      beatDivisor
    );
  }

  public getClosestSnappedTimeByTime(time: number): number {
    return this.getClosestSnappedTime(time, this.getClosestBeatDivisor(time));
  }

  public getClosestSnappedTimeByTimingPoint(
    timingPoint: TimingControlPoint,
    time: number,
    beatDivisor: number
  ): number {
    const beatLength = timingPoint.BeatLength / beatDivisor;
    const beatLengths = Math.round((time - timingPoint.time) / beatLength);
    return timingPoint.time + beatLengths * beatLength;
  }

  public getClosestBeatDivisor(time: number, referenceTime = time): number {
    const timingPoint = this.timingPointAt(referenceTime);

    let closestDivisor = 0;
    let closestTime = Number.MAX_VALUE;

    BindableBeatDivisor.VALID_DIVISORS.forEach((divisor) => {
      const distanceFromSnap = Math.abs(
        time -
          this.getClosestSnappedTimeByTimingPoint(timingPoint, time, divisor)
      );
      if (Precision.definitelyBigger(closestTime, distanceFromSnap)) {
        closestDivisor = divisor;
        closestTime = distanceFromSnap;
      }
    });

    return closestDivisor;
  }

  #BPMMaxOrMin(i: number): number {
    return (
      60000 /
      (this.timingPoints.sort().at(i) ?? TimingControlPoint.DEFAULT).BeatLength
    );
  }

  public BPMMaximum(): number {
    return this.#BPMMaxOrMin(-1);
  }

  public BPMMinimum(): number {
    return this.#BPMMaxOrMin(0);
  }

  public clear(): void {
    this.groups.length = 0;
    this.timingPoints.length = 0;
    this.effectPoints.length = 0;
  }

  public add(time: number, controlPoint: ControlPoint): boolean {
    if (this.checkAlreadyExisting(time, controlPoint)) return false;
    this.groupAt(time, true)?.add(controlPoint);
    return true;
  }

  public groupAt(
    time: number,
    addIfNotExisting = false
  ): ControlPointGroup | undefined {
    const group = this.groups.find((g) => g.time === time);

    if (!group && addIfNotExisting) {
      const newGroup = new ControlPointGroup(time);

      newGroup.itemAdded.addListener(this.groupItemAdded);
      newGroup.itemRemoved.addListener(this.groupItemRemoved);

      return newGroup;
    }

    return group;
  }

  #unexpectedControlPointType(): string {
    return `Unexpected control point type was passed to a listen call in a ${ControlPointInfo.name}`;
  }

  #switchControlPointLists<T>(
    controlPoint: ControlPoint,
    handle: (list: ControlPoint[]) => T
  ): T {
    switch (controlPoint.constructor) {
      case TimingControlPoint:
        return handle(this.timingPoints);
      case EffectControlPoint:
        return handle(this.effectPoints);
      default:
        throw this.#unexpectedControlPointType();
    }
  }

  public groupItemAdded(controlPoint: ControlPoint): void {
    this.#switchControlPointLists(controlPoint, (l) => l.push(controlPoint));
  }

  public groupItemRemoved(controlPoint: ControlPoint): void {
    this.#switchControlPointLists(controlPoint, (l) =>
      l.splice(l.indexOf(controlPoint))
    );
  }

  public checkAlreadyExisting(time: number, newPoint: ControlPoint): boolean {
    let existing: ControlPoint | null = null;

    switch (newPoint.constructor) {
      case TimingControlPoint:
        existing = this.timingPointAt(time);
        break;
      case EffectControlPoint:
        existing = this.effectPointAt(time);
        break;
      default:
        throw this.#unexpectedControlPointType();
    }

    return existing ? newPoint.isRedundant(existing) === true : false;
  }

  public deepClone(): ControlPointInfo {
    const clone: ControlPointInfo = new this.constructor.prototype();

    this.allControlPoints().forEach((p) => clone.add(p.time, p.deepClone()));

    return clone;
  }
}
