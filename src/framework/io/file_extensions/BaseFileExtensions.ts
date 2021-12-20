import FileExtensionContainer from './FileExtensionsContainer';

export default class BaseFileExtensions extends FileExtensionContainer {
  public static readonly instance = new BaseFileExtensions();
  public readonly ts = this.createFileExtension('ts');
  public readonly js = this.createFileExtension('js');

  private constructor() {
    super();
  }
}
