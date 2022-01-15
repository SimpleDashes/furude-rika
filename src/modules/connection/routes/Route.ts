import UrlBuilder from '../apis/http/UrlBuilder';
import type ContentHost from '../ContentHost';
import type IRoute from './IRoute';

export default class Route implements IRoute {
  readonly #host: ContentHost;
  readonly #route: string;

  public readonly path;

  public constructor(host: ContentHost, route: string) {
    this.#host = host;
    this.#route = route;
    this.path = UrlBuilder.join(this.#host.Url, this.#route);
  }
}
