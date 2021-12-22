import {
  CommandInteraction,
  CacheType,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../client/FurudeRika';
import BaseCommand from '../framework/commands/BaseCommand';
import CommandPrecondition from '../framework/commands/preconditions/abstracts/CommandPrecondition';
import FurudeCommandWrapper from './FurudeCommandWrapper';

export default abstract class FurudeCommand extends BaseCommand<FurudeRika> {
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
}
