import _ from 'lodash';
import type ControlPointInfo from '../../beatmaps/control_points/ControlPointInfo';
import DifficultyControlPoint from '../../beatmaps/control_points/DifficultyControlPoint';
import type IBeatmapDifficultyInfo from '../../beatmaps/IBeatmapDifficultyInfo';
import BindableNumber from '../../bindables/BindableNumber';
import type { ValueChangeEvent } from '../../bindables/BindableValue';
import Event from '../../events/Event';
import HitObjectTypes from './types/HitObjectTypes';

export default class HitObject {
  /**
   * A small adjustment to the start time of control points to account for rounding/precision errors.
   */
  protected static readonly CONTROL_POINT_LENIENCY = 1.0;

  public defaultsApplied = new Event<[HitObject]>();

  public readonly startTimeBindable = new BindableNumber();

  public get StartTime(): number {
    return this.startTimeBindable.Value;
  }

  public set StartTime(value: number) {
    this.startTimeBindable.Value = value;
  }

  public difficultyControlPoint = DifficultyControlPoint.DEFAULT;

  public kiai = false;

  public getEndTime(): number {
    return HitObjectTypes.HasDuration(this) ? this.endTime : this.StartTime;
  }

  public readonly nestedHitObjects: HitObject[] = [];

  private onStartTimeChanged = (time: ValueChangeEvent<number>): void => {
    const offset = time.newValue - time.oldValue;
    this.nestedHitObjects.forEach((nested) => (nested.StartTime += offset));
    this.difficultyControlPoint.time = time.newValue;
  };

  public applyDefaults(
    controlPointInfo: ControlPointInfo,
    difficulty: IBeatmapDifficultyInfo
  ): void {
    if (this.difficultyControlPoint === DifficultyControlPoint.DEFAULT) {
      this.difficultyControlPoint = new DifficultyControlPoint();
    }

    this.nestedHitObjects.length = 0;
    this.createNestedHitObjects();

    if (HitObjectTypes.HasComboInformation(this)) {
      for (const hitObject of this.nestedHitObjects) {
        if (HitObjectTypes.HasComboInformation(hitObject)) {
          hitObject.comboIndexBindable.bindTo(this.comboIndexBindable);
          hitObject.comboIndexWithOffsetsBindable.bindTo(
            this.comboIndexWithOffsetsBindable
          );
          hitObject.indexInCurrentComboBindable.bindTo(
            this.indexInCurrentComboBindable
          );
        }
      }
    }

    _.sortBy(this.nestedHitObjects, (o) => o.StartTime);
    this.nestedHitObjects.forEach((h) =>
      h.applyDefaults(controlPointInfo, difficulty)
    );

    this.startTimeBindable.removeValueChangeListener(this.onStartTimeChanged);
    this.startTimeBindable.addValueChangeListener(this.onStartTimeChanged);

    this.defaultsApplied.invoke(this);
  }

  protected createNestedHitObjects(): void {
    /**
     *
     */
  }

  protected applyDefaultsToSelf(
    controlPointInfo: ControlPointInfo,
    _difficulty: IBeatmapDifficultyInfo
  ): void {
    this.kiai = controlPointInfo.effectPointAt(
      this.StartTime + HitObject.CONTROL_POINT_LENIENCY
    ).KiaiMode;
    // TODO HITWINDOWS
  }

  protected addNested(hitObject: HitObject): void {
    this.nestedHitObjects.push(hitObject);
  }

  // TODO JUDGEMENT
}
