import { CommandInteraction, CacheType, Snowflake } from 'discord.js';
import PermissionPrecondition from './abstracts/PermissionPrecondition';

export default class OwnerPrecondition extends PermissionPrecondition {
  public readonly ownerIDS: Snowflake[];

  public constructor(ownerIDS: Snowflake[]) {
    super();
    this.ownerIDS = ownerIDS;
  }

  protected validateInternally(
    interaction: CommandInteraction<CacheType>
  ): boolean {
    return this.ownerIDS.includes(interaction.user.id);
  }
}
