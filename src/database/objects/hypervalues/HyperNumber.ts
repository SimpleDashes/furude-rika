import HyperValue from './HyperValue';

export default abstract class HyperNumber<K> extends HyperValue<number, K> {
  public defaultValue(): number {
    return 0;
  }
}
