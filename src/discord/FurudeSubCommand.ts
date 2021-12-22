import {
  CommandInteraction,
  CacheType,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../client/FurudeRika';
import CommandPrecondition from '../framework/commands/preconditions/abstracts/CommandPrecondition';
import SubCommand from '../framework/commands/SubCommand';
import FurudeCommandWrapper from './FurudeCommandWrapper';

export default abstract class FurudeSubCommand extends SubCommand<FurudeRika> {
  public override async onInsufficientPermissions(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>,
    precondition: CommandPrecondition,
    missingPermissions?: PermissionResolvable
  ): Promise<void> {
    FurudeCommandWrapper.onInsufficientPermissions(
      client,
      interaction,
      precondition,
      missingPermissions
    );
  }

  public override async onMissingRequiredSubCommands(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    FurudeCommandWrapper.onMissingRequiredSubCommands(client, interaction);
  }
}
