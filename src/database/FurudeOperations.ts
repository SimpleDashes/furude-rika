import {
  CommandInteraction,
  InteractionReplyOptions,
  MessagePayload,
  WebhookEditMessageOptions,
} from 'discord.js';
import { BaseEntity } from 'typeorm';
import MessageCreator from '../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../modules/framework/interactions/InteractionUtils';
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
    operation: IDatabaseOperation,
    options:
      | string
      | MessagePayload
      | WebhookEditMessageOptions
      | (InteractionReplyOptions & { fetchReply: true }) = {}
  ) {
    const displayString = operation.successfully
      ? MessageCreator.success(operation.response)
      : MessageCreator.error(operation.response);

    Object.assign(options, { content: displayString });

    return InteractionUtils.reply(interaction, options);
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
