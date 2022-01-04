import { CommandInteraction } from 'discord.js';
import { BaseEntity } from 'typeorm';
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

  /**
   *
   * @param entity The entity which will be saved if all operations where finished successfully
   * @param operations The said operations that will determine if the entity will be saved or not.
   * @returns wether we saved the entity or not.
   */
  public static async saveWhenSuccess(
    entity: BaseEntity,
    ...operations: IDatabaseOperation[]
  ) {
    if (operations.every((o) => o.successfully)) {
      await entity.save();
      return true;
    }
    return false;
  }
}
