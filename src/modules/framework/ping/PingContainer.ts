import ManagesInternalArray from '../containers/ManagesInternalArray';
import PingData from './PingData';

export default class PingContainer<
  T extends PingData<any>
> extends ManagesInternalArray<T> {
  public constructor() {
    super();
  }
}
