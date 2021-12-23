import fs from 'fs/promises';
import DirectoryMapper from '../DirectoryMapper';
import BaseFileExtensions from '../file_extensions/BaseFileExtensions';
import path from 'path';
import consola from 'consola';
import Constructor from '../../interfaces/Constructor';

export type resolvedClass<T> = {
  directory: DirectoryMapper;
  object: T;
};
export default abstract class ClassResolver<T> {
  private directoryMaps: DirectoryMapper[];

  public constructor(...directoryMaps: DirectoryMapper[]) {
    this.directoryMaps = directoryMaps;
  }

  public async getAllObjects(): Promise<resolvedClass<T>[]> {
    const objects: resolvedClass<T>[] = [];
    for await (const commandMapper of this.directoryMaps) {
      const mapCommands = await this.getObjectForMapperLoop(commandMapper);
      objects.push(...mapCommands);
    }
    return objects;
  }

  protected async getObjectsForMapper(
    directoryMapper: DirectoryMapper,
    onImportedClass?: (object: T) => void
  ): Promise<resolvedClass<T>[]> {
    const objects: resolvedClass<T>[] = [];
    const dir = directoryMapper.path;
    const extension = BaseFileExtensions.instance.js.toString();
    const files = (
      await fs.readdir(dir, {
        withFileTypes: true,
      })
    ).filter((file) => file.isFile() && file.name.endsWith(extension));
    for await (const file of files) {
      const importPath = path.join(dir, file.name);
      const relativePath = path.relative(__dirname, importPath);
      consola.log(`Trying to import object at: ${importPath}`);
      const possibleClass = await import(relativePath);
      const classClass: Constructor<T> = possibleClass.default ?? possibleClass;
      const classObject: unknown = new classClass();
      if (this.isInstanceOfT(classObject)) {
        const tClassObject = classObject as T;
        if (onImportedClass) onImportedClass(tClassObject);
        objects.push({
          directory: directoryMapper,
          object: tClassObject,
        });
      } else {
        consola.error(`Failed to import object at: ${importPath}`);
      }
    }
    return objects;
  }

  protected async getObjectForMapperLoop(
    directoryMapper: DirectoryMapper
  ): Promise<resolvedClass<T>[]> {
    const objects: resolvedClass<T>[] = [];
    if (directoryMapper.subDirectories?.length == 0) {
      objects.push(...(await this.getObjectsForMapper(directoryMapper)));
      return objects;
    }
    if (!directoryMapper.subDirectories) return objects;
    for await (const subDirectory of directoryMapper.subDirectories) {
      objects.push(...(await this.getObjectsForMapper(subDirectory)));
    }
    return objects;
  }

  protected abstract isInstanceOfT(object: unknown): boolean;
}
