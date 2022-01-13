import assert from 'assert';
import { PermissionResolvable, GuildMember } from 'discord.js';
import ICommandContext from '../interfaces/ICommandContext';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class GuildPermissionsPrecondition extends CommandPrecondition {
  public readonly requiredPermissions: PermissionResolvable;

  public constructor(requiredPermissions: PermissionResolvable) {
    super();
    this.requiredPermissions = requiredPermissions;
  }

  protected async validateInternally(
    context: ICommandContext
  ): Promise<boolean> {
    assert(context.interaction.inGuild());
    return (context.interaction.member as GuildMember).permissions.has(
      this.requiredPermissions
    );
  }
}
