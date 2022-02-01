import type ControlPointInfo from '../../base/beatmaps/control_points/ControlPointInfo';
import type IBeatmapDifficultyInfo from '../../base/beatmaps/IBeatmapDifficultyInfo';
import { difficultyRangeRaw } from '../../base/beatmaps/IBeatmapDifficultyInfo';
import BindableBoolean from '../../base/bindables/BindableBoolean';
import BindableInteger from '../../base/bindables/BindableInteger';
import Vector2 from '../../base/rulesets/math/Vector2';
import HitObject from '../../base/rulesets/objects/HitObject';
import type IHasComboInformation from '../../base/rulesets/objects/types/IHasComboInformation';
import type IHasPosition from '../../base/rulesets/objects/types/IHasPosition';
import ArrayHelper from '../../base/utils/ArrayHelper';

export default class OsuHitObject
  extends HitObject
  implements IHasPosition, IHasComboInformation
{
  /**
   * The radius of hit objects (ie. the radius of a {@link HitCircle}).
   */
  public static OBJECT_RADIUS = 64;

  /**
   * Scoring distance with a speed-adjusted beat length of 1 second (ie. the speed slider balls move through their track).
   */
  public static BASE_SCORING_DISTANCE = 100;

  /**
   * Minimum preempt time at AR=10.
   */
  public static PREEMPT_MIN = 450;

  public timePreempt = 600;
  public timeFadeIn = 400;

  #stackVector(vector: Vector2): Vector2 {
    return vector.add(this.stackOffset);
  }

  public position: Vector2 = new Vector2();

  public get stackedPosition(): Vector2 {
    return this.#stackVector(this.position);
  }

  public get x(): number {
    return this.position.x;
  }

  public set x(x: number) {
    this.position.x = x;
  }

  public get y(): number {
    return this.position.y;
  }

  public set y(y: number) {
    this.position.y = y;
  }

  public get endPosition(): Vector2 {
    return this.position;
  }

  public get stackedEndPosition(): Vector2 {
    return this.#stackVector(this.endPosition);
  }

  public readonly stackHeightBindable = new BindableInteger();

  public get stackHeight(): number {
    return this.stackHeightBindable.Value;
  }

  public set stackHeight(stack: number) {
    this.stackHeightBindable.Value = stack;
  }

  public get stackOffset(): Vector2 {
    return new Vector2(this.stackHeight * this.scale * -6.4);
  }

  public get radius(): number {
    return OsuHitObject.OBJECT_RADIUS * this.scale;
  }

  public scale = 1;

  public newCombo = false;

  public readonly comboOffset = 0;

  public indexInCurrentComboBindable = new BindableInteger();

  public get indexInCurrentCombo(): number {
    return this.indexInCurrentComboBindable.Value;
  }

  public set indexInCurrentCombo(index: number) {
    this.indexInCurrentComboBindable.Value = index;
  }

  public comboIndexBindable = new BindableInteger();

  public get comboIndex(): number {
    return this.comboIndexBindable.Value;
  }

  public set comboIndex(index: number) {
    this.comboIndexBindable.Value = index;
  }

  public comboIndexWithOffsetsBindable = new BindableInteger();

  public get comboIndexWithOffsets(): number {
    return this.comboIndexWithOffsetsBindable.Value;
  }

  public set comboIndexWithOffsets(index: number) {
    this.comboIndexWithOffsetsBindable.Value = index;
  }

  public lastInComboBindable = new BindableBoolean();

  public get lastInCombo(): boolean {
    return this.lastInComboBindable.Value;
  }

  public set lastInCombo(lastInCombo: boolean) {
    this.lastInComboBindable.Value = lastInCombo;
  }

  public constructor() {
    super();
    this.stackHeightBindable.bindValueChanged((height) => {
      ArrayHelper.ofType(this.nestedHitObjects, OsuHitObject).forEach(
        (nested) => (nested.stackHeight = height.newValue)
      );
    });
  }

  protected override applyDefaultsToSelf(
    controlPointInfo: ControlPointInfo,
    difficulty: IBeatmapDifficultyInfo
  ): void {
    super.applyDefaultsToSelf(controlPointInfo, difficulty);

    this.timePreempt = difficultyRangeRaw(
      difficulty.approachRate,
      1800,
      1200,
      OsuHitObject.PREEMPT_MIN
    );

    this.timeFadeIn =
      400 * Math.min(1, this.timePreempt / OsuHitObject.PREEMPT_MIN);

    this.scale = (1 - (0.7 * (difficulty.circleSize - 5)) / 5) / 2;
  }
}
