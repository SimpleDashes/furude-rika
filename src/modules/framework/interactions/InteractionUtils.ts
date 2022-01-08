import {
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  MessageComponentInteraction,
  MessagePayload,
  WebhookEditMessageOptions,
} from 'discord.js';

export default class InteractionUtils {
  public static async reply(
    interaction:
      | CommandInteraction<CacheType>
      | MessageComponentInteraction<CacheType>,
    options:
      | string
      | MessagePayload
      | WebhookEditMessageOptions
      | (InteractionReplyOptions & { fetchReply: true }) = {}
  ) {
    return interaction.deferred || interaction.replied
      ? await interaction.editReply(options)
      : await interaction.reply(options);
  }

  public static async safeUpdate(
    interaction: ButtonInteraction,
    options: string | MessagePayload | InteractionUpdateOptions
  ) {
    try {
      await interaction.update(options);
    } catch {}
  }
}
