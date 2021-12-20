import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  CacheType,
  CommandInteraction,
  Guild,
} from 'discord.js';
import consola from 'consola';
import BaseBot from '../client/BaseBot';
import { RequestData, REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

type resFunctions = Partial<IWithTaskCompletionListener> & {
  onCommandNotFound?: () => void;
  onInvalidCommand?: () => void;
};

const rest = new REST({ version: '9' });
let putToken = false;

export default class DeployHandler {
  public static async deployCommand(options: {
    client: BaseBot;
    commandName: string;
    isDebug: boolean;
    interaction?: CommandInteraction<CacheType>;
    guild?: Guild;
    resFunctions: resFunctions;
  }) {
    const { client, commandName, isDebug, interaction, resFunctions } = options;
    const { onCommandNotFound, onInvalidCommand, onError, onSuccess } =
      resFunctions;

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

  public static async deployAll(
    client: BaseBot,
    isDebug: boolean,
    resFunctions?: IWithTaskCompletionListener
  ) {
    if (!putToken) {
      putToken = true;
      rest.setToken(client.devInfo!.token!);
    }

    const commands = [...client.commands.values()].map((command) =>
      command.toJSON()
    );

    const req: RequestData = { body: commands };

    try {
      await rest.put(
        isDebug
          ? Routes.applicationGuildCommands(
              client.user!.id,
              client.devInfo.developmentGuild?.id!
            )
          : Routes.applicationCommands(client.user!.id),
        req
      );
      if (resFunctions?.onSuccess) resFunctions.onSuccess();
    } catch (e) {
      consola.error(e);
      if (resFunctions?.onError) resFunctions.onError();
    }
  }
}
