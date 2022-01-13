import ManagesInternalArray from '../containers/ManagesInternalArray';
import type PingData from './PingData';

export default class PingContainer<
  A,
  T extends PingData<A>
> extends ManagesInternalArray<T> {
  public constructor() {
    super();
  }
}
