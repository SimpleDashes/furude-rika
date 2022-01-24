export default class PingData<T> {
  public readonly pingWhat: string;
  public ping?: (args: T) => Promise<number>;

  public constructor(pingWhat: string) {
    this.pingWhat = pingWhat;
  }

  public setPingCallback(ping: (args: T) => Promise<number>): this {
    this.ping = ping;
    return this;
  }
}
