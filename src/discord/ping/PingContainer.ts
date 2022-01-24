import type PingData from './PingData';

export default class PingContainer<A, T extends PingData<A>> {
  public readonly data: T[] = [];
}
