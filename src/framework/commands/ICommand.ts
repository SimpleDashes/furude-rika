import { Client, CommandInteraction } from 'discord.js'
import IDiscordOption from '../options/interfaces/IDiscordOption'
import ICommandInformation from './ICommandInformation'

export default interface ICommand<T extends Client> {
  readonly information: ICommandInformation
  readonly argumentOptions: Partial<IDiscordOption<any>>[]
  run(client: T, interaction: CommandInteraction): Promise<void>
}
