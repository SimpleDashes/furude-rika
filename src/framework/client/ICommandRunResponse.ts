import { CommandInteraction } from 'discord.js';
import ICommand from '../commands/interfaces/ICommand';
import BaseBot from './BaseBot';

export default interface ICommandRunResponse {
  interaction: CommandInteraction;
  command: ICommand<BaseBot, any>;
}
