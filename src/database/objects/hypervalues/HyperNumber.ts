import { assertDefined } from '../../../modules/framework/types/TypeAssertions';
import { HyperTypes } from './HyperTypes';
import HyperValue from './HyperValue';

export default abstract class HyperNumber<K> extends HyperValue<number, K> {
  public override getValueSwitchedForType(
    key: K | null | undefined,
    type: HyperTypes
  ): number {
    const returnValue = super.getValueSwitchedForType(key, type);
    assertDefined(returnValue);
    return returnValue;
  }
  public override global: number = this.defaultValue();
  public defaultValue(): number {
    return 0;
  }
}
