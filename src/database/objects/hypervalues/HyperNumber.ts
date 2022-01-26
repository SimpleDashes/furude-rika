import { assertDefined } from 'discowork';
import { Column } from 'typeorm';
import type { HyperTypes } from './HyperTypes';
import HyperValue from './HyperValue';

export default abstract class HyperNumber<K> extends HyperValue<number, K> {
  @Column('float')
  public override global: number = this.defaultValue();
  public override getValueSwitchedForType(
    key: K | null | undefined,
    type: HyperTypes
  ): number {
    const returnValue = super.getValueSwitchedForType(key, type);
    assertDefined(returnValue);
    return returnValue;
  }
  public defaultValue(): number {
    return 0;
  }
}
