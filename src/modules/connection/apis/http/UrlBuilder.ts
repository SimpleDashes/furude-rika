export default class URLBuilder {
  /**
   *
   * Adds a sub path for the url.
   */
  public static join(url: string, pathname: string): string {
    let finalPath = url;
    if (pathname) finalPath += `/${pathname}`;
    return finalPath;
  }
}
