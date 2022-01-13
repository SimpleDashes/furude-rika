import type { CommandInteraction, CacheType } from 'discord.js';
import type ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';
import type { OmittedCommandContext } from '../../modules/framework/commands/interfaces/ICommandContext';
import type FurudeRika from '../FurudeRika';

export default abstract class BaseContext implements ICommandContext {
  public readonly client: FurudeRika;
  public readonly interaction: CommandInteraction<CacheType>;
  public readonly db;

  public constructor(baseContext: OmittedCommandContext) {
    this.client = baseContext.client as FurudeRika;
    this.interaction = baseContext.interaction;
    this.db = this.client.db;
  }

  public async get(): Promise<this> {
    await this.build();
    return this;
  }

  public abstract build(): Promise<void>;
}
