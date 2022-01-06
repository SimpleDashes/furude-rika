export default class RequestBuilder {
  public static build(url: string, params: any): string {
    if (!url.endsWith('?')) url += '?';

    const rParams = params as Record<string, string>;
    for (const param in params) {
      url += `${param}=${rParams[param]}&`;
    }

    url = url.slice(0, -1);

    return url;
  }
}
