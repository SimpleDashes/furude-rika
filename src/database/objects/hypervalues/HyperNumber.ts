import HyperValue from './HyperValue';

export default abstract class HyperNumber extends HyperValue<number> {
  public defaultValue(): number {
    return 0;
  }
}
