import path from 'path'

export default class DirectoryMapper {
  public path: string
  public subDirectories?: DirectoryMapper[] = []

  public constructor(rootDirectory: string) {
    this.path = rootDirectory
  }

  public ruleSub(mapper: DirectoryMapper) {
    mapper.path = path.join(this.path, mapper.path)
    mapper.subDirectories?.forEach((sub) => {
      this.ruleSub(sub)
    })
  }

  public addSub(...mappers: DirectoryMapper[]) {
    mappers.forEach((mapper) => {
      this.ruleSub(mapper)
      this.subDirectories?.push(mapper)
    })
    return this
  }

  public createSub(rootDirectory: string) {
    this.addSub(new DirectoryMapper(rootDirectory))
    return this
  }
}
