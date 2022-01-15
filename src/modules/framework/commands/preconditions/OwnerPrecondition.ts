import type { Snowflake } from 'discord.js';
import type ICommandContext from '../contexts/ICommandContext';
import CommandPrecondition from './abstracts/CommandPrecondition';

export default class OwnerPrecondition extends CommandPrecondition {
  public readonly ownerIDS: Snowflake[];

  public constructor(ownerIDS: Snowflake[]) {
    super();
    this.ownerIDS = ownerIDS;
  }

  protected async validateInternally(
    context: ICommandContext
  ): Promise<boolean> {
    return this.ownerIDS.includes(context.interaction.user.id);
  }
}
