import FileExtension from './FileExtension';

export default abstract class FileExtensionContainer {
  private fileExtensions: FileExtension[] = [];

  public get FileExtensions() {
    return this.fileExtensions;
  }

  protected createFileExtension(fileExtensionName: string) {
    const fileExtension = new FileExtension(fileExtensionName);
    this.fileExtensions.push(fileExtension);
    return fileExtension;
  }
}
