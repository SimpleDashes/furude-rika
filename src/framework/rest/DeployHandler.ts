import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  CacheType,
  CommandInteraction,
  Guild,
} from 'discord.js';
import consola from 'consola';
import BaseBot from '../client/BaseBot';

export default class DeployHandler {
  public static async deployCommand(options: {
    client: BaseBot;
    commandName: string;
    isDebug: boolean;
    interaction?: CommandInteraction<CacheType>;
    guild?: Guild;
    onCommandNotFound?: () => void;
    onInvalidCommand?: () => void;
    onError?: () => void;
    onSuccess?: () => void;
  }) {
    const {
      client,
      commandName,
      isDebug,
      interaction,
      onCommandNotFound,
      onInvalidCommand,
      onError,
      onSuccess,
    } = options;
    const command = client.commands.get(commandName);

    if (!command) {
      if (onCommandNotFound) onCommandNotFound();
      return;
    }

    if (!command.name || !command.description) {
      if (onInvalidCommand) onInvalidCommand();
      return;
    }

    const commandOptions: ApplicationCommandOptionData[] = [];
    for (const option of command.argumentOptions) {
      if (!option.name || !option.description || !option.apiType) {
        const reportMissing = (string: string) => {
          consola.error(
            `Option from command: ${command.name}, missing: ${string}`
          );
        };
        if (!option.name) {
          reportMissing('name');
        }
        if (!option.description) {
          reportMissing('description');
        }
        if (!option.apiType) {
          reportMissing('type');
        }
        if (onInvalidCommand) onInvalidCommand();
        return;
      }
      commandOptions.push({
        name: option.name,
        description: option.description,
        type: option.apiType,
      });
    }

    const commandData: ApplicationCommandData = {
      name: command.name,
      description: command.description,
      options: commandOptions,
    };

    let commandReceiver = null;
    if (isDebug) {
      commandReceiver = options.guild?.commands ?? interaction?.guild?.commands;
      if (!commandReceiver) {
        if (onError) onError();
        return;
      }
    } else {
      commandReceiver = client.application?.commands;
    }

    await commandReceiver?.create(commandData);
    if (onSuccess) onSuccess();
  }
}
