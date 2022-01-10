import { PermissionResolvable, GuildMember } from 'discord.js';
import IRunsCommand from '../interfaces/IRunsCommand';
import PermissionPrecondition from './abstracts/PermissionPrecondition';

export default class GuildPermissionsPrecondition extends PermissionPrecondition {
  public readonly requiredPermissions: PermissionResolvable;

  public constructor(requiredPermissions: PermissionResolvable) {
    super();
    this.requiredPermissions = requiredPermissions;
  }

  protected async validateInternally(
    runner: IRunsCommand<any>
  ): Promise<boolean> {
    return (
      runner.interaction.inGuild() &&
      (runner.interaction.member as GuildMember).permissions.has(
        this.requiredPermissions
      )
    );
  }
}
