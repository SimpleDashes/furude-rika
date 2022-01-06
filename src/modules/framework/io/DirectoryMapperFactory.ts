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

  public async buildMappers(root: string = this.root) {
    const files = (await fs.readdir(root, { withFileTypes: true })).filter(
      (file) => !this.excludes.includes(file.name)
    );
    const mappers: DirectoryMapper[] = [];
    for await (const file of files) {
      if (file.isDirectory()) {
        const directoryPath = path.join(root, file.name);
        const mapper = new DirectoryMapper(directoryPath);
        const subMaps = await this.buildMappers(directoryPath);
        if (subMaps) {
          mappers.push(...subMaps);
        }
        mappers.push(mapper);
      }
    }

    return mappers;
  }
}
