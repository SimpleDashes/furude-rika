export default class RequestBuilder {
  public static build(url: string, params: unknown): string {
    if (!url.endsWith('?')) url += '?';

    const rParams = params as Record<string, string>;
    for (const param in rParams) {
      url += `${param}=${rParams[param]}&`;
    }

    url = url.slice(0, -1);

    return url;
  }
}
