import Protocol from './Protocol';

export default abstract class ContentHost {
  public readonly url: string;

  public get Url(): string {
    return `${this.protocol}://${this.url}.${this.domain}`;
  }

  public readonly domain: string;

  public protocol: Protocol;

  public constructor(
    url: string,
    domain: string,
    protocol: Protocol = Protocol.https
  ) {
    this.url = url;
    this.domain = domain;
    this.protocol = protocol;
  }
}
