import { Snowflake } from 'discord.js';
import IRunsCommand from '../interfaces/IRunsCommand';
import PermissionPrecondition from './abstracts/PermissionPrecondition';

export default class OwnerPrecondition extends PermissionPrecondition {
  public readonly ownerIDS: Snowflake[];

  public constructor(ownerIDS: Snowflake[]) {
    super();
    this.ownerIDS = ownerIDS;
  }

  protected async validateInternally(
    runner: IRunsCommand<any>
  ): Promise<boolean> {
    return this.ownerIDS.includes(runner.interaction.user.id);
  }
}
