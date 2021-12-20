import DirectoryMapper from './DirectoryMapper';
import fs from 'fs/promises';
import path from 'path';

export default class DirectoryMapperFactory {
  public readonly root: string;
  public readonly commandMappers: DirectoryMapper[] = [];

  public constructor(root: string) {
    this.root = root;
  }

  public async buildMappers(root: string = this.root) {
    const files = await fs.readdir(root, { withFileTypes: true });
    const mappers: DirectoryMapper[] = [];
    for await (const file of files) {
      if (file.isDirectory()) {
        const directoryPath = path.join(root, file.name);
        const mapper = new DirectoryMapper(directoryPath);
        const subMaps = await this.buildMappers(directoryPath);
        mapper.addSub(...subMaps);
        mappers.push(mapper);
      }
    }
    return mappers;
  }
}
