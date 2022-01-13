export default class UrlBuilder {
  /**
   * Adds a sub path for the url
   */
  public static join(url: string, path: string): string {
    let finalPath = url;
    if (path) {
      finalPath += `/${path}`;
    }
    return finalPath;
  }
}
