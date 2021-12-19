import IHasString from '../../interfaces/IHasString'

export default class FileExtension implements IHasString {
  private extensionName: string

  public constructor(extensionName: string) {
    this.extensionName = extensionName
  }

  public toString() {
    return `.${this.getExtensionName()}`
  }

  public getExtensionName() {
    return this.extensionName
  }
}
