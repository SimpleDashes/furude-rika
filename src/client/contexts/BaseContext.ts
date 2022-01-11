import { CommandInteraction, CacheType } from 'discord.js';
import ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';
import FurudeRika from '../FurudeRika';

export default abstract class BaseContext
  implements ICommandContext<FurudeRika>
{
  public readonly client: FurudeRika;
  public readonly interaction: CommandInteraction<CacheType>;
  public readonly db;

  public constructor(baseContext: ICommandContext<FurudeRika>) {
    this.client = baseContext.client;
    this.interaction = baseContext.interaction;
    this.db = baseContext.client.db;
  }

  public async get(): Promise<this> {
    await this.build();
    return this;
  }

  public abstract build(): Promise<void>;
}
