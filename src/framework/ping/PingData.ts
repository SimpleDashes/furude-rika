export default class PingData<T> {
  public readonly pingWhat: string
  public ping?: (args: T) => number

  public constructor(pingWhat: string) {
    this.pingWhat = pingWhat
  }

  public setPingCallback(ping: (args: T) => number) {
    this.ping = ping
    return this
  }
}
