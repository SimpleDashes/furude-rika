import BindableValue from './BindableValue';

export default class BindableNumber extends BindableValue<number> {
  public minValue?: number;
  public maxValue?: number;

  public constructor(
    value?: number,
    options: {
      minValue?: number;
      maxValue?: number;
    } = {}
  ) {
    super(value);
    this.minValue = options.minValue;
    this.maxValue = options.maxValue;
  }

  public override applyValueChangeRules(value: number): number {
    if (this.minValue) {
      value = Math.max(this.minValue, value);
    }
    if (this.maxValue) {
      value = Math.min(this.maxValue, value);
    }
    return value;
  }

  public override defaultCurrentValue(): number | null {
    return 0;
  }
}
