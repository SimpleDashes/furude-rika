import { APIButtonComponent } from 'discord-api-types';
import { MessageButton, MessageButtonOptions } from 'discord.js';

export default class MessageButtonFactory {
  private currentID = 0;

  public newButton(
    data?: MessageButton | MessageButtonOptions | APIButtonComponent | undefined
  ): MessageButton {
    const button = new MessageButton(data);
    if (!button.customId) {
      button.customId = (this.currentID++).toString();
    }
    return button;
  }
}
