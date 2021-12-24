import {
  CommandInteraction,
  CacheType,
  PermissionResolvable,
  GuildMember,
} from 'discord.js';
import PermissionPrecondition from './abstracts/PermissionPrecondition';

export default class GuildPermissionsPrecondition extends PermissionPrecondition {
  public readonly requiredPermissions: PermissionResolvable;

  public constructor(requiredPermissions: PermissionResolvable) {
    super();
    this.requiredPermissions = requiredPermissions;
  }

  protected validateInternally(
    interaction: CommandInteraction<CacheType>
  ): boolean {
    return (
      interaction.inGuild() &&
      (interaction.member as GuildMember).permissions.has(
        this.requiredPermissions
      )
    );
  }
}
