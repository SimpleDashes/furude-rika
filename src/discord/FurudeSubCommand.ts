import {
  CommandInteraction,
  CacheType,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../client/FurudeRika';
import SubCommand from '../framework/commands/SubCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';

export default abstract class FurudeSubCommand extends SubCommand<FurudeRika> {
  public override async onInsufficientPermissions(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>,
    missingPermissions?: PermissionResolvable
  ): Promise<void> {
    FurudeCommandWrapper.onInsufficientPermissions(
      this,
      client,
      interaction,
      missingPermissions
    );
  }
}
