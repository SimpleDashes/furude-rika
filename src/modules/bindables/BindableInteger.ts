import BindableNumber from './BindableNumber';

export default class BindableInteger extends BindableNumber {
  public override applyValueChangeRules(value: number): number {
    return super.applyValueChangeRules(Math.round(value));
  }
}
