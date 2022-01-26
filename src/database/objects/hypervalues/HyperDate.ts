import { assertDefinedGet } from 'discowork';
import { Column } from 'typeorm';
import HyperValue from './HyperValue';

export default abstract class HyperDate<K> extends HyperValue<Date, K> {
  @Column(() => Date)
  public override global: Date | null = null;
  public defaultValue(): Date {
    return new Date();
  }
  public override currentLocal(key: K): Date {
    return new Date(assertDefinedGet(super.currentLocal(key)));
  }
}
