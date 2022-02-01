import BindableValue from './BindableValue';

export default class BindableBoolean extends BindableValue<boolean> {
  public override defaultCurrentValue(): boolean {
    return false;
  }
}
