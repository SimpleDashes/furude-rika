import {
  CommandInteraction,
  CacheType,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../client/FurudeRika';
import BaseCommand from '../framework/commands/BaseCommand';
import ICommandInformation from '../framework/commands/ICommandInformation';
import MessageFactory from '../helpers/MessageFactory';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';

export default abstract class FurudeCommand extends BaseCommand<FurudeRika> {
  public constructor(information: ICommandInformation) {
    super(information);
  }

  public override async onInsufficientPermissions(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>,
    _missingPermissions?: PermissionResolvable
  ): Promise<void> {
    await interaction.deferReply();
    await interaction.editReply({
      content: MessageFactory.error(
        this.information.ownerOnly
          ? client.localizer.get(FurudeTranslationKeys.ERRO_OWNER_ONLY_COMMAND)
          : client.localizer.get(
              FurudeTranslationKeys.ERROR_MISSING_PERMISSIONS
            )
      ),
    });
  }
}
