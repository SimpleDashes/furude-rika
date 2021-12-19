import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
} from 'discord.js'
import DirectoryMapper from '../io/DirectoryMapper'
import CommandResolver from '../io/CommandResolver'
import IBot from './IBot'
import BaseCommand from '../commands/BaseCommand'
import ICommandRunResponse from './ICommandRunResponse'
import consola from 'consola'
import IBotDevInformation from './IBotDevInformation'
import DirectoryMapperFactory from '../io/DirectoryMapperFactory'

export default abstract class BaseBot extends Client implements IBot {
  public readonly commands: Collection<string, BaseCommand<BaseBot>> =
    new Collection()
  public readonly commandMappers: DirectoryMapper[] = []
  protected devInfo: IBotDevInformation
  private devOptions: IDevOptions
  private onCommandsLoaded?: () => void
  private commandMapperFactory?: DirectoryMapperFactory

  public constructor(
    options: ClientOptions,
    devOptions: IDevOptions,
    onCommandsLoaded?: () => void,
    commandMapperFactory?: DirectoryMapperFactory,
    ...commandMappers: DirectoryMapper[]
  ) {
    super(options)
    this.devOptions = devOptions
    this.commandMappers = commandMappers
    this.commandMapperFactory = commandMapperFactory
    this.onCommandsLoaded = onCommandsLoaded
    this.devInfo = {
      token: process.env[this.devOptions.ENV_TOKEN_VAR],
    }
  }

  private async loadCommands() {
    if (this.commandMapperFactory) {
      const newMappers = await this.commandMapperFactory.buildMappers()
      this.commandMappers.push(...newMappers)
    }
    const commandResolver = new CommandResolver(...this.commandMappers)
    await commandResolver.getAllCommands().then((res) => {
      res.forEach((command) => {
        this.commands.set(command.name, command)
      })
      if (this.onCommandsLoaded) this.onCommandsLoaded()
    })
  }

  async start() {
    await this.login(this.devInfo.token)

    const developmentGuildID =
      process.env[this.devOptions.ENV_DEVELOPMENT_SERVER]

    this.on('ready', async (_client: Client) => {
      if (developmentGuildID) {
        this.devInfo.developmentGuild = await this.guilds.fetch(
          developmentGuildID
        )
        consola.success(`Development Guild: ${this.devInfo.developmentGuild}`)
      }
      await this.loadCommands()
    })

    this.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand) return

      const commandInteraction = interaction as CommandInteraction
      const command = this.commands.get(commandInteraction.commandName)

      if (!command) return

      await command.run(this, commandInteraction)
      this.onCommandRun({
        interaction: commandInteraction,
        command: command,
      })
    })
  }

  onCommandRun(response: ICommandRunResponse) {
    consola.log(`${response.command} command was ran!`)
  }
}
