import Protocol from './Protocol';

export default abstract class ContentHost {
  public readonly url: string;

  get Url() {
    return `${this.protocol}://${this.url}.${this.domain}`;
  }

  public readonly domain: string;

  public constructor(url: string, domain: string) {
    this.url = url;
    this.domain = domain;
  }

  public protocol: Protocol = Protocol.https;
}
