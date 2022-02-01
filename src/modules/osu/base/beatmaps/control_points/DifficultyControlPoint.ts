import assert from 'assert';
import BindableNumber from '../../bindables/BindableNumber';
import ControlPoint from './ControlPoint';

export default class DifficultyControlPoint extends ControlPoint {
  public static readonly DEFAULT = new DifficultyControlPoint();

  public readonly sliderVelocityBindable = new BindableNumber(1, {
    minValue: 1,
    maxValue: 10,
  });

  /**
   * The slider velocity at this control point.
   */
  public get SliderVelocity(): number {
    return this.sliderVelocityBindable.Value;
  }

  public set SliderVelocity(value: number) {
    this.sliderVelocityBindable.Value = value;
  }

  public isRedundant(existing: ControlPoint): boolean {
    return (
      existing instanceof DifficultyControlPoint &&
      this.SliderVelocity === existing.SliderVelocity
    );
  }

  public override copyFrom(other: ControlPoint): void {
    assert(other instanceof DifficultyControlPoint);

    this.SliderVelocity = other.SliderVelocity;

    super.copyFrom(other);
  }
}
