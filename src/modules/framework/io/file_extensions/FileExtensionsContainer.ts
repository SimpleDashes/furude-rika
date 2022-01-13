import FileExtension from './FileExtension';

export default abstract class FileExtensionContainer {
  private fileExtensions: FileExtension[] = [];

  public get FileExtensions(): FileExtension[] {
    return this.fileExtensions;
  }

  protected createFileExtension(fileExtensionName: string): FileExtension {
    const fileExtension = new FileExtension(fileExtensionName);
    this.fileExtensions.push(fileExtension);
    return fileExtension;
  }
}
