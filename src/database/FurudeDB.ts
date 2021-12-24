import { Guild, GuildChannel, User } from 'discord.js';
import {
  BaseEntity,
  Connection,
  createConnection,
  FindOneOptions,
} from 'typeorm';
import Constructor from '../framework/interfaces/Constructor';
import SnowFlakeIDEntity from './entity/abstracts/SnowFlakeIDEntity';
import DBChannel from './entity/DBChannel';
import DBCitizen from './entity/DBCitizen';
import DBGuild from './entity/DBGuild';
import DBUser from './entity/DBUser';
import IHasSnowFlakeID from './interfaces/IHasSnowFlakeID';

export default class FurudeDB {
  public readonly uri: string;
  private connection?: Connection;

  get Connection() {
    return this.connection;
  }

  public constructor() {
    this.uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@furude.9zjpv.mongodb.net/furude?retryWrites=true&w=majority`;
  }

  public async connect() {
    this.connection = await createConnection({
      type: 'mongodb',
      url: this.uri,
      useNewUrlParser: true,
      synchronize: false,
      logging: true,
      useUnifiedTopology: true,
      entities: ['dist/database/entity/*.js'],
    });
  }

  private async createEntityWhenNotFound<T extends BaseEntity>(
    constructor: Constructor<T>,
    findEntity: () => Promise<T>,
    onNotFound?: (o: T) => Promise<void>
  ) {
    let foundOnDB: boolean = false;
    let find: T | null = null;
    try {
      const found = await findEntity();
      if (found) {
        find = found;
        foundOnDB = true;
      }
    } catch {}
    const entity = new constructor();
    Object.assign(entity, find);
    if (onNotFound && !foundOnDB) onNotFound(entity);
    return entity;
  }

  private getSnowFlakeQuery(
    snowflakeable: IHasSnowFlakeID
  ): FindOneOptions<any> {
    return {
      where: {
        id: snowflakeable.id,
      },
    };
  }

  private identifySnowflake<T extends SnowFlakeIDEntity>(
    entity: T,
    snowflakeable: IHasSnowFlakeID
  ): T {
    if (!entity.id) {
      entity.id = snowflakeable.id;
    }
    return entity;
  }

  private async getSnowFlake(snowflakeable: IHasSnowFlakeID, type: any) {
    const identifyJustCreated = (o: any, justCreated: boolean) => {
      const asJustCreated = o as IHasJustCreatedIdentifier;
      asJustCreated.justCreated = justCreated;
    };
    return this.identifySnowflake(
      await this.createEntityWhenNotFound(
        type,
        async () => {
          const found = await type.findOne(
            this.getSnowFlakeQuery(snowflakeable)
          );
          identifyJustCreated(found, false);
          return found;
        },
        async (o) => {
          identifyJustCreated(o, true);
        }
      ),
      snowflakeable
    );
  }

  public async getUser(user: User): Promise<DBUser> {
    return await this.getSnowFlake(user, DBUser);
  }

  public async getCitizen(user: User): Promise<DBCitizen> {
    return await this.getSnowFlake(user, DBCitizen);
  }

  public async getGuild(guild: Guild): Promise<DBGuild> {
    return await this.getSnowFlake(guild, DBGuild);
  }

  public async getChannel(channel: GuildChannel): Promise<DBGuild> {
    return await this.getSnowFlake(channel, DBChannel);
  }
}
