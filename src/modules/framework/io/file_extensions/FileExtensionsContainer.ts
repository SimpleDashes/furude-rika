import ManagesInternalArray from '../../containers/ManagesInternalArray';
import FileExtension from './FileExtension';

export default class FileExtensionContainer extends ManagesInternalArray<FileExtension> {
  public get FileExtensions(): FileExtension[] {
    return this.InternalArray;
  }

  protected createFileExtension(fileExtensionName: string): FileExtension {
    const fileExtension = new FileExtension(fileExtensionName);
    return this.pushGet(fileExtension);
  }
}
