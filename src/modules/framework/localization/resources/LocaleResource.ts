export default class LocaleResource<S, T> {
  public readonly locale: S;
  public readonly structure: T;

  public constructor(locale: S, structure: T) {
    this.locale = locale;
    this.structure = structure;
  }
}
