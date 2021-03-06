import SubRoute from '../../routes/SubRoute';
import RequestBuilder from '../http/RequestBuilder';
import type APIRoute from './APIRoute';

export default class APISubRoute<T extends APIRoute<T>> extends SubRoute {
  #base: T;

  public constructor(route: T, subRoute: string) {
    super(route, subRoute);
    this.#base = route;
  }

  protected build<P>(params: P): string {
    return RequestBuilder.build(this.path, {
      ...params,
      ...(this.#base.baseParams as Record<string, string>),
    });
  }
}
