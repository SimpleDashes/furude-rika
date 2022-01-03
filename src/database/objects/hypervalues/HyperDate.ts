import HyperValue from './HyperValue';

export default abstract class HyperDate extends HyperValue<Date> {
  public defaultValue(): Date {
    return new Date();
  }
}
