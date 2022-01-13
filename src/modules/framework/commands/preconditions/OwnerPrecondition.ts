import { Snowflake } from 'discord.js';
import ICommandContext from '../interfaces/ICommandContext';
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
