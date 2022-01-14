import fs from 'fs/promises';
import type DirectoryMapper from './DirectoryMapper';
import BaseFileExtensions from './file_extensions/BaseFileExtensions';
import path from 'path';
import consola from 'consola';
import type Constructor from '../interfaces/Constructor';

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
    for (const commandMapper of this.directoryMaps) {
      const mapCommands = await this.getObjectForMapperLoop(commandMapper);
      objects.push(...mapCommands);
    }
    return objects;
  }

  protected async getObjectsForMapper(
    directoryMapper: DirectoryMapper,
    onImportedClass?: (object: T) => void,
    args: never[] = []
  ): Promise<resolvedClass<T>[]> {
    const objects: resolvedClass<T>[] = [];
    const dir = directoryMapper.path;
    const extension = BaseFileExtensions.instance.js.toString();
    const files = (
      await fs.readdir(dir, {
        withFileTypes: true,
      })
    ).filter((file) => file.isFile() && file.name.endsWith(extension));
    for (const file of files) {
      const importPath = path.join(dir, file.name);
      const relativePath = path.relative(__dirname, importPath);
      const possibleClass = await import(relativePath);
      const classClass: Constructor<[...never], T> =
        possibleClass.default ?? possibleClass;
      const classObject: unknown = new classClass(...args);
      if (this.isInstanceOfT(classObject)) {
        const tClassObject = classObject as T;
        if (onImportedClass) onImportedClass(tClassObject);
        objects.push({
          directory: directoryMapper,
          object: tClassObject,
        });
        consola.success(`Imported object at: ${importPath}`);
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
    if (directoryMapper.subDirectories?.length === 0) {
      objects.push(...(await this.getObjectsForMapper(directoryMapper)));
      return objects;
    }
    if (!directoryMapper.subDirectories) return objects;
    for (const subDirectory of directoryMapper.subDirectories) {
      objects.push(...(await this.getObjectsForMapper(subDirectory)));
    }
    return objects;
  }

  protected abstract isInstanceOfT(object: unknown): boolean;
}
