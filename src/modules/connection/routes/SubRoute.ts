import URLBuilder from '../apis/http/UrlBuilder';
import IRoute from './IRoute';
import Route from './Route';

export default class SubRoute implements IRoute {
  public readonly path: string;
  public constructor(route: Route, subRoute: string) {
    this.path = URLBuilder.join(route.path, subRoute);
  }
}
