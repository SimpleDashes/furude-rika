import UrlBuilder from '../apis/http/UrlBuilder';
import ContentHost from '../ContentHost';
import IRoute from './IRoute';

export default class Route implements IRoute {
  private readonly host: ContentHost;
  private readonly route: string;

  public readonly path;

  public constructor(host: ContentHost, route: string) {
    this.host = host;
    this.route = route;
    this.path = UrlBuilder.join(this.host.Url, this.route);
  }
}
