import type IHasString from '../../interfaces/IHasString';

export default class FileExtension implements IHasString {
  #extensionName: string;

  public constructor(extensionName: string) {
    this.#extensionName = extensionName;
  }

  public toString(): string {
    return `.${this.getExtensionName()}`;
  }

  public getExtensionName(): string {
    return this.#extensionName;
  }
}
