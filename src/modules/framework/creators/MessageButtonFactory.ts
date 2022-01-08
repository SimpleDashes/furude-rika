import { APIButtonComponent } from 'discord-api-types';
import { MessageButton, MessageButtonOptions } from 'discord.js';

export default class MessageButtonFactory {
  private static currentID = 0;
  public readonly createdButtons: MessageButton[] = [];

  public newButton(
    data?: MessageButton | MessageButtonOptions | APIButtonComponent | undefined
  ): MessageButton {
    const button = new MessageButton(data);
    if (!button.customId) {
      button.customId = (MessageButtonFactory.currentID++).toString();
    }
    this.createdButtons.push(button);
    return button;
  }
}
