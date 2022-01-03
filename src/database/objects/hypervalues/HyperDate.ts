import HyperValue from './HyperValue';

export default abstract class HyperDate<K> extends HyperValue<Date, K> {
  public defaultValue(): Date {
    return new Date();
  }
}
