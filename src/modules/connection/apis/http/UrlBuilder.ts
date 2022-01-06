export default class UrlBuilder {
  /**
   * Adds a sub path for the url
   */
  public static join(url: string, path: string) {
    return `${url}/${path}`;
  }
}
