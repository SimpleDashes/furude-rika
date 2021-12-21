import {
  CacheType,
  Client,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../client/FurudeRika';
import ICommand from '../framework/commands/ICommand';
import MessageFactory from '../helpers/MessageFactory';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';

export default class FurudeCommandWrapper {
  public static async onInsufficientPermissions<
    T extends FurudeRika,
    C extends ICommand<T, C>
  >(
    command: ICommand<T, C>,
    client: T,
    interaction: CommandInteraction<CacheType>,
    _missingPermissions?: PermissionResolvable
  ): Promise<void> {
    await interaction.deferReply();
    await interaction.editReply({
      content: MessageFactory.error(
        command.information.ownerOnly
          ? client.localizer.get(FurudeTranslationKeys.ERRO_OWNER_ONLY_COMMAND)
          : client.localizer.get(
              FurudeTranslationKeys.ERROR_MISSING_PERMISSIONS
            )
      ),
    });
  }
}
