import UrlBuilder from '../apis/http/UrlBuilder';
import type IRoute from './IRoute';
import type Route from './Route';

export default class SubRoute implements IRoute {
  public readonly path: string;
  public constructor(route: Route, subRoute: string) {
    this.path = UrlBuilder.join(route.path, subRoute);
  }
}
