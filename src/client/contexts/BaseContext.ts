import type { CommandInteraction, CacheType } from 'discord.js';
import type ICommandContext from '../../modules/framework/commands/contexts/ICommandContext';
import type { OmittedCommandContext } from '../../modules/framework/commands/contexts/ICommandContext';
import type FurudeRika from '../FurudeRika';

export default abstract class BaseContext<A> implements ICommandContext<A> {
  public readonly client: FurudeRika;
  public readonly interaction: CommandInteraction<CacheType>;
  public readonly db;
  public args!: A;

  public constructor(baseContext: OmittedCommandContext) {
    this.client = baseContext.client as FurudeRika;
    this.interaction = baseContext.interaction;
    this.db = this.client.db;
  }

  public abstract build(): Promise<void>;
}
