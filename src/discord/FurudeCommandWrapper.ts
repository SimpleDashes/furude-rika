import {
  CacheType,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../client/FurudeRika';
import ICommand from '../framework/commands/ICommand';
import CommandPrecondition from '../framework/commands/preconditions/abstracts/CommandPrecondition';
import OwnerPrecondition from '../framework/commands/preconditions/OwnerPrecondition';
import MessageFactory from '../helpers/MessageFactory';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';

export default class FurudeCommandWrapper {
  public static async onInsufficientPermissions<
    T extends FurudeRika,
    C extends ICommand<T, C>
  >(
    client: T,
    interaction: CommandInteraction<CacheType>,
    precondition?: CommandPrecondition,
    _missingPermissions?: PermissionResolvable
  ): Promise<void> {
    await interaction.reply({
      content: MessageFactory.error(
        await (precondition instanceof OwnerPrecondition
          ? client.localizer.get(
              FurudeTranslationKeys.ERRO_OWNER_ONLY_COMMAND,
              {
                discord: {
                  interaction,
                },
              }
            )
          : client.localizer.get(
              FurudeTranslationKeys.ERROR_MISSING_PERMISSIONS,
              {
                discord: {
                  interaction,
                },
              }
            ))
      ),
    });
  }

  public static async onMissingRequiredSubCommands(
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.reply({
      content: MessageFactory.error(
        FurudeTranslationKeys.SUBCOMMAND_MISSING_REQUIRED
      ),
    });
  }
}
