import assert from 'assert';
import BindableNumber from '../../bindables/BindableNumber';
import BindableValue from '../../bindables/BindableValue';
import TimeSignatures from '../timing/TimeSignatures';
import ControlPoint from './ControlPoint';

export default class TimingControlPoint extends ControlPoint {
  public readonly timeSignaturesBindable = new BindableValue(
    TimeSignatures.SIMPLE_QUAD
  );

  private static readonly DEFAULT_BEAT_LENGTH = 1000;

  public static readonly DEFAULT = ((): TimingControlPoint => {
    const point = new TimingControlPoint();

    point.beatLengthBindable.Disabled = true;
    point.timeSignaturesBindable.Disabled = true;

    return point;
  })();

  public get TimeSignature(): TimeSignatures {
    return this.timeSignaturesBindable.Value;
  }

  public set TimeSignature(signature: TimeSignatures) {
    this.timeSignaturesBindable.Value = signature;
  }

  public beatLengthBindable = new BindableNumber(
    TimingControlPoint.DEFAULT_BEAT_LENGTH,
    {
      minValue: 6,
      maxValue: 60000,
    }
  );

  public get BeatLength(): number {
    return this.beatLengthBindable.Value;
  }

  public set BeatLength(beatLength: number) {
    this.beatLengthBindable.Value = beatLength;
  }

  public bpm(): number {
    return 60000 / this.BeatLength;
  }

  public isRedundant(): boolean {
    return false;
  }

  public override copyFrom(other: ControlPoint): void {
    assert(other instanceof TimingControlPoint);

    this.TimeSignature = other.TimeSignature;
    this.BeatLength = other.BeatLength;

    super.copyFrom(other);
  }
}
