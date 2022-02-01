import type HitObject from '../../objects/HitObject';

export default class DifficultyHitObject {
  public readonly baseObject: HitObject;

  public readonly lastObject: HitObject;

  public readonly deltaTime: number;

  public readonly startTime: number;

  public readonly endTime: number;

  public constructor(
    hitObject: HitObject,
    lastObject: HitObject,
    clockRate: number
  ) {
    this.baseObject = hitObject;
    this.lastObject = lastObject;
    this.deltaTime = (hitObject.StartTime - lastObject.StartTime) / clockRate;
    this.startTime = hitObject.StartTime / clockRate;
    this.endTime = hitObject.getEndTime() / clockRate;
  }
}
