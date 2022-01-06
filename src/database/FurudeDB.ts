import { Guild, GuildChannel, User } from 'discord.js';
import {
  BaseEntity,
  Connection,
  createConnection,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import Constructor from '../modules/framework/interfaces/Constructor';
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

  private assignNewEntityToEntity<T extends BaseEntity>(
    constructor: Constructor<T>,
    findEntity: T | null,
    onNotFound?: (o: T) => void
  ) {
    const entity = new constructor();
    if (findEntity) {
      Object.assign(entity, findEntity);
    }
    if (onNotFound && !findEntity) onNotFound(entity);
    return entity;
  }

  private async createEntityWhenNotFound<T extends BaseEntity>(
    constructor: Constructor<T>,
    findEntity: () => Promise<T>,
    onNotFound?: (o: T) => void
  ) {
    let find: T | null = null;
    try {
      find = await findEntity();
    } catch {}
    return this.assignNewEntityToEntity(constructor, find, onNotFound);
  }

  public getSnowFlakeQuery(
    snowflakeable: IHasSnowFlakeID
  ): FindOneOptions<SnowFlakeIDEntity> {
    return {
      where: {
        s_id: snowflakeable.id,
      },
    };
  }

  private identifySnowflake<T extends SnowFlakeIDEntity>(
    entity: T,
    snowflakeable: IHasSnowFlakeID
  ): T {
    if (!entity.s_id) {
      entity.s_id = snowflakeable.id;
    }
    return entity;
  }

  public async getSnowflake<T extends SnowFlakeIDEntity>(
    snowflake: IHasSnowFlakeID,
    type: any
  ): Promise<T> {
    const identifyJustCreated = (o: any, justCreated: boolean) => {
      const asJustCreated = o as IHasJustCreatedIdentifier;
      asJustCreated.justCreated = justCreated;
    };
    return this.identifySnowflake(
      await this.createEntityWhenNotFound(
        type,
        async () => {
          const found = await type.findOne(this.getSnowFlakeQuery(snowflake));
          identifyJustCreated(found, false);
          return found;
        },
        (o) => {
          identifyJustCreated(o, true);
        }
      ),
      snowflake
    );
  }

  public async getSnowflakes<T extends SnowFlakeIDEntity>(
    type: any,
    query?: FindManyOptions<T>
  ): Promise<T[]> {
    const snowFlakes: T[] = await type.find(query);
    for (const snowFlake of snowFlakes) {
      this.assignNewEntityToEntity(type, snowFlake);
    }
    return snowFlakes;
  }

  public USER = new UserGetter(this);

  public CITIZEN = new CitizenGetter(this);

  public GUILD = new GuildGetter(this);

  public CHANNEL = new ChannelGetter(this);
}

interface IDatabaseGetterGetOnly<
  K extends IHasSnowFlakeID,
  T extends SnowFlakeIDEntity
> {
  get(key: K): Promise<T>;
}

interface IDatabaseGetterGetAllOnly<T extends SnowFlakeIDEntity> {
  getAllOn(query?: FindManyOptions<T>): Promise<T[]>;
}

interface IDatabaseGetter<
  K extends IHasSnowFlakeID,
  T extends SnowFlakeIDEntity
> extends IDatabaseGetterGetOnly<K, T>,
    IDatabaseGetterGetAllOnly<T> {}

abstract class BaseDatabaseGetter {
  protected db: FurudeDB;
  protected abstract typeObject: any;

  public constructor(db: FurudeDB) {
    this.db = db;
  }

  protected static async get<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >(that: BaseDatabaseGetter, key: K): Promise<T> {
    return await that.db.getSnowflake(key, that.typeObject);
  }

  protected static async getAllOn<T extends SnowFlakeIDEntity>(
    that: BaseDatabaseGetter,
    query?: FindManyOptions<T>
  ): Promise<T[]> {
    return await that.db.getSnowflakes(that.typeObject, query);
  }
}

abstract class DatabaseGetterGetOnly<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >
  extends BaseDatabaseGetter
  implements IDatabaseGetterGetOnly<K, T>
{
  public async get(key: K): Promise<T> {
    return await BaseDatabaseGetter.get(this, key);
  }
}

/**
abstract class DatabaseGetterGetAllOnly<
    M extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >
  extends BaseDatabaseGetter
  implements IDatabaseGetterGetAllOnly<M, T>
{
  public async getAllOn(key: M): Promise<T[]> {
    return await BaseDatabaseGetter.getAll(this, key);
  }
}
 */

abstract class DatabaseGetter<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >
  extends BaseDatabaseGetter
  implements IDatabaseGetter<K, T>
{
  public async get(key: K): Promise<T> {
    return await BaseDatabaseGetter.get(this, key);
  }
  public async getAllOn(query?: FindManyOptions<T>): Promise<T[]> {
    return await BaseDatabaseGetter.getAllOn(this, query);
  }
}

abstract class UserBasedDatabaseGetter<
  T extends SnowFlakeIDEntity
> extends DatabaseGetter<User, T> {
  public override async get(user: User): Promise<T> {
    return super.get(user);
  }
  public override async getAllOn(query?: FindManyOptions<T>): Promise<T[]> {
    return super.getAllOn(query);
  }
}

class UserGetter extends UserBasedDatabaseGetter<DBUser> {
  protected typeObject: any = DBUser;
}

class CitizenGetter extends UserBasedDatabaseGetter<DBCitizen> {
  protected typeObject: any = DBCitizen;
}

class GuildGetter extends DatabaseGetterGetOnly<Guild, DBGuild> {
  protected typeObject: any = DBGuild;
  public override async get(guild: Guild): Promise<DBGuild> {
    return super.get(guild);
  }
}

class ChannelGetter extends DatabaseGetter<GuildChannel, DBChannel> {
  protected typeObject: any = DBChannel;
  public override async get(channel: GuildChannel): Promise<DBChannel> {
    return super.get(channel);
  }
}

export {
  UserGetter,
  ChannelGetter,
  GuildGetter,
  CitizenGetter,
  UserBasedDatabaseGetter,
  DatabaseGetter,
  DatabaseGetterGetOnly,
  BaseDatabaseGetter,
  IDatabaseGetter,
  IDatabaseGetterGetAllOnly,
  IDatabaseGetterGetOnly,
};
