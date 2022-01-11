import assert from 'assert';
import { PermissionResolvable, GuildMember } from 'discord.js';
import ICommandContext from '../interfaces/ICommandContext';
import PermissionPrecondition from './abstracts/PermissionPrecondition';

export default class GuildPermissionsPrecondition extends PermissionPrecondition {
  public readonly requiredPermissions: PermissionResolvable;

  public constructor(requiredPermissions: PermissionResolvable) {
    super();
    this.requiredPermissions = requiredPermissions;
  }

  protected async validateInternally(
    context: ICommandContext<any>
  ): Promise<boolean> {
    assert(context.interaction.inGuild());
    return (context.interaction.member as GuildMember).permissions.has(
      this.requiredPermissions
    );
  }
}
