import type { APIButtonComponent } from 'discord-api-types';
import type { MessageButtonOptions } from 'discord.js';
import { MessageButton } from 'discord.js';

export default class MessageButtonFactory {
  static #currentID = 0;
  public readonly createdButtons: MessageButton[] = [];

  public newButton(
    data?: MessageButton | MessageButtonOptions | APIButtonComponent | undefined
  ): MessageButton {
    const button = new MessageButton(data);
    if (!button.customId) {
      button.customId = (MessageButtonFactory.#currentID++).toString();
    }
    this.createdButtons.push(button);
    return button;
  }
}
