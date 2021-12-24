import { CommandInteraction } from 'discord.js';
import MessageFactory from '../helpers/MessageFactory';
import IDatabaseOperation from './interfaces/IDatabaseOperation';

export default class FurudeOperations {
  public static any(
    successfully: boolean,
    response: string
  ): IDatabaseOperation {
    return {
      successfully,
      response,
    };
  }

  public static success(response: string): IDatabaseOperation {
    return this.any(true, response);
  }

  public static error(response: string): IDatabaseOperation {
    return this.any(false, response);
  }

  public static async answerInteraction(
    interaction: CommandInteraction,
    operation: IDatabaseOperation
  ) {
    const displayString = operation.successfully
      ? MessageFactory.success(operation.response)
      : MessageFactory.error(operation.response);

    return interaction.deferred
      ? await interaction.editReply(displayString)
      : await interaction.reply(displayString);
  }
}
