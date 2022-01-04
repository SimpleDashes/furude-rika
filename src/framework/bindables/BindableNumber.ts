import BindableValue from './BindableValue';

export default class BindableNumber extends BindableValue<number> {
  public minValue: BindableNumber | null = null;
  public maxValue: BindableNumber | null = null;

  public constructor(
    value?: number,
    defaultValue: number | undefined = value,
    options: {
      minValue?: number;
      maxValue?: number;
    } = {}
  ) {
    super(value, defaultValue);
    if (options.minValue) {
      this.minValue = new BindableNumber();
      this.minValue.Current = options.minValue;
    }
    if (options.maxValue) {
      this.maxValue = new BindableNumber();
      this.maxValue.Current = options.maxValue;
    }
  }

  public override applyValueChangeRules(value: number): number {
    if (this.minValue) {
      value = Math.max(this.minValue.Current, value);
    }
    if (this.maxValue) {
      value = Math.min(this.maxValue.Current, value);
    }
    return value;
  }

  public override defaultCurrentValue(): number | null {
    return 0;
  }
}
