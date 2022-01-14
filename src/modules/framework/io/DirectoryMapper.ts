import path from 'path';

export default class DirectoryMapper {
  public path: string;
  public subDirectories: DirectoryMapper[] = [];

  public constructor(rootDirectory: string) {
    this.path = rootDirectory;
  }

  public ruleSubDirectory(mapper: DirectoryMapper): void {
    mapper.path = path.join(this.path, mapper.path);
    for (const subDirectory of mapper.subDirectories) {
      this.ruleSubDirectory(subDirectory);
    }
  }

  public addSubDirectory(...mappers: DirectoryMapper[]): this {
    for (const mapper of mappers) {
      this.ruleSubDirectory(mapper);
      this.subDirectories?.push(mapper);
    }
    return this;
  }

  public createSubDirectory(rootDirectory: string): this {
    this.addSubDirectory(new DirectoryMapper(rootDirectory));
    return this;
  }
}
