import assert from 'assert';
import BindableBoolean from '../../bindables/BindableBoolean';
import BindableNumber from '../../bindables/BindableNumber';
import ControlPoint from './ControlPoint';

export default class EffectControlPoint extends ControlPoint {
  public static readonly DEFAULT = ((): EffectControlPoint => {
    const point = new EffectControlPoint();
    return point;
  })();

  public readonly omitFirstBarlineBindable = new BindableBoolean();

  public get OmitFirstBarLine(): boolean {
    return this.omitFirstBarlineBindable.Value;
  }

  public set OmitFirstBarLine(omit: boolean) {
    this.omitFirstBarlineBindable.Value = omit;
  }

  public readonly scrollSpeedBindable = new BindableNumber(1, {
    minValue: 0.01,
    maxValue: 10,
  });

  public get ScrollSpeed(): number {
    return this.scrollSpeedBindable.Value;
  }

  public set ScrollSpeed(speed: number) {
    this.scrollSpeedBindable.Value = speed;
  }

  public readonly kiaiModeBindable = new BindableBoolean();

  public get KiaiMode(): boolean {
    return this.kiaiModeBindable.Value;
  }

  public set KiaiMode(kiai: boolean) {
    this.kiaiModeBindable.Value = kiai;
  }

  public isRedundant(existing: ControlPoint): boolean {
    return (
      !this.OmitFirstBarLine &&
      existing instanceof EffectControlPoint &&
      this.KiaiMode === existing.KiaiMode &&
      this.OmitFirstBarLine === existing.OmitFirstBarLine &&
      this.ScrollSpeed === existing.ScrollSpeed
    );
  }

  public override copyFrom(other: ControlPoint): void {
    assert(other instanceof EffectControlPoint);

    this.KiaiMode = other.KiaiMode;
    this.OmitFirstBarLine = other.OmitFirstBarLine;
    this.ScrollSpeed = other.ScrollSpeed;
  }
}
