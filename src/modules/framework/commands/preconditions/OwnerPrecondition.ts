import { Snowflake } from 'discord.js';
import ICommandContext from '../interfaces/ICommandContext';
import PermissionPrecondition from './abstracts/PermissionPrecondition';

export default class OwnerPrecondition extends PermissionPrecondition {
  public readonly ownerIDS: Snowflake[];

  public constructor(ownerIDS: Snowflake[]) {
    super();
    this.ownerIDS = ownerIDS;
  }

  protected async validateInternally(
    context: ICommandContext<any>
  ): Promise<boolean> {
    return this.ownerIDS.includes(context.interaction.user.id);
  }
}
