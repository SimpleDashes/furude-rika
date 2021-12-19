import fs from 'fs/promises'
import BaseCommand from '../commands/BaseCommand'
import DirectoryMapper from './DirectoryMapper'
import BaseFileExtensions from './file_extensions/BaseFileExtensions'
import path from 'path'
import consola from 'consola'
import Constructor from '../interfaces/Constructor'

export default class CommandResolver {
  private commandMaps: DirectoryMapper[]

  public constructor(...commandMaps: DirectoryMapper[]) {
    this.commandMaps = commandMaps
  }

  public async getAllCommands() {
    const commands: BaseCommand<any>[] = []
    for await (const commandMapper of this.commandMaps) {
      const mapCommands = await this.getCommandsForMapperLoop(commandMapper)
      commands.push(...mapCommands)
    }
    return commands
  }

  private async getCommandsForMapper(
    commandMapper: DirectoryMapper
  ): Promise<BaseCommand<any>[]> {
    const commands: BaseCommand<any>[] = []
    const dir = commandMapper.path
    const extension = BaseFileExtensions.instance.js.toString()
    const files = (
      await fs.readdir(dir, {
        withFileTypes: true,
      })
    ).filter((file) => file.isFile() && file.name.endsWith(extension))
    for await (const file of files) {
      const importPath = path.join(dir, file.name)
      const relativePath = path.relative(__dirname, importPath)
      consola.log(`Trying to import command at: ${relativePath}`)
      const possibleClass = await import(relativePath)
      const commandClass: Constructor<BaseCommand<any>> =
        possibleClass.default ?? possibleClass
      const command: BaseCommand<any> = new commandClass()
      consola.success(`Imported command: ${command.name}`)
      commands.push(command)
    }
    return commands
  }

  private async getCommandsForMapperLoop(
    commandMapper: DirectoryMapper
  ): Promise<BaseCommand<any>[]> {
    const commands: BaseCommand<any>[] = []
    if (commandMapper.subDirectories?.length == 0) {
      commands.push(...(await this.getCommandsForMapper(commandMapper)))
      return commands
    }
    if (!commandMapper.subDirectories) return commands
    for await (const subDirectory of commandMapper.subDirectories) {
      commands.push(...(await this.getCommandsForMapper(subDirectory)))
    }
    return commands
  }
}
