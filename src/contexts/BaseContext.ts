import type { CommandInteraction } from 'discord.js';
import type CommandContext from 'discowork/src/commands/interfaces/CommandContext';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/src/commands/interfaces/CommandContext';
import type { TypedArgs } from 'discowork/src/contexts/TypedArgs';
import type FurudeRika from '../client/FurudeRika';

export default abstract class BaseContext<A> implements CommandContext<A> {
  public readonly client: FurudeRika;
  public readonly interaction: CommandInteraction;
  public readonly db;
  public readonly args!: TypedArgs<A>;

  public constructor(baseContext: CommandContextOnlyInteractionAndClient) {
    // TODO FIX TYPING
    this.client = baseContext.client as FurudeRika;
    this.interaction = baseContext.interaction as CommandInteraction;
    this.db = this.client.db;
  }

  public abstract build(): Promise<void>;
}
