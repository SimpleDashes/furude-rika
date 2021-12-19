import { CommandInteraction } from 'discord.js'
import BaseCommand from '../commands/BaseCommand'

export default interface ICommandRunResponse {
  interaction: CommandInteraction
  command: BaseCommand<any>
}
