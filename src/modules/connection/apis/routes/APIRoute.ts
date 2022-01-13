import type ContentHost from '../../ContentHost';
import Route from '../../routes/Route';

export default class APIRoute<T> extends Route {
  public readonly baseParams: T | unknown = {};

  public constructor(host: ContentHost, route: string, baseParams?: T) {
    super(host, route);
    this.baseParams = baseParams ?? {};
  }
}
