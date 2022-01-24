import type { CommandInteraction } from 'discord.js';
import type { TypedArgs } from 'discowork';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/lib/commands/interfaces/CommandContext';
import type CommandContext from 'discowork/lib/commands/interfaces/CommandContext';
import type FurudeRika from '../client/FurudeRika';

export default abstract class BaseContext<A> implements CommandContext<A> {
  public readonly client: FurudeRika;
  public readonly interaction: CommandInteraction;
  public readonly db;
  public readonly args!: TypedArgs<A>;

  public constructor(baseContext: CommandContextOnlyInteractionAndClient) {
    this.client = baseContext.client as FurudeRika;
    this.interaction = baseContext.interaction as CommandInteraction;
    this.db = this.client.db;
  }

  public abstract build(): Promise<void>;
}
