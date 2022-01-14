import DirectoryMapper from './DirectoryMapper';
import fs from 'fs/promises';
import path from 'path';

export default class DirectoryMapperFactory {
  public readonly root: string;
  public readonly commandMappers: DirectoryMapper[] = [];
  public readonly excludes: string[];

  public constructor(root: string, excludes?: string[]) {
    this.root = root;
    this.excludes = excludes ?? [];
  }

  public async buildMappers(
    root: string = this.root
  ): Promise<DirectoryMapper[]> {
    const mappers: DirectoryMapper[] = [];
    const files = await fs.readdir(root, { withFileTypes: true });

    for (const file of files) {
      if (this.excludes.includes(file.name)) continue;
      if (file.isDirectory()) {
        const directoryPath = path.join(root, file.name);
        const mapper = new DirectoryMapper(directoryPath);
        const subMappers = await this.buildMappers(directoryPath);
        if (subMappers.length > 0) {
          mappers.push(...subMappers);
        }
        mappers.push(mapper);
      }
    }

    return mappers;
  }
}
