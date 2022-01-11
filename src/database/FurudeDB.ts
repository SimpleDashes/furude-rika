import { hoursToSeconds } from 'date-fns';
import { Guild, GuildChannel, Snowflake, User } from 'discord.js';
import {
  BaseEntity,
  Connection,
  createConnection,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { CacheCollection } from '../client/managers/abstracts/BaseFurudeCacheManager';
import SnowFlakeIDEntity from './entity/abstracts/SnowFlakeIDEntity';
import DBChannel from './entity/DBChannel';
import DBCitizen from './entity/DBCitizen';
import DBGuild from './entity/DBGuild';
import DBOsuPlayer from './entity/DBOsuPlayer';
import DBUser from './entity/DBUser';
import IHasSnowFlakeID from './interfaces/IHasSnowFlakeID';
import TClassRepository from './types/TClassRepository';

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
    constructor: TClassRepository<T>,
    findEntity: T | null,
    onNotFound?: (o: T) => void
  ): T {
    const entity = new constructor();
    if (findEntity) {
      Object.assign(entity, findEntity);
    }
    if (onNotFound && !findEntity) onNotFound(entity);
    return entity;
  }

  private async createEntityWhenNotFound<T extends BaseEntity>(
    constructor: TClassRepository<T>,
    findEntity: () => Promise<T | undefined>,
    onNotFound?: (o: T) => void
  ): Promise<T> {
    let find: T | null = null;
    try {
      const found = await findEntity();
      if (found) {
        find = found;
      }
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
    type: TClassRepository<T>,
    query?: FindOneOptions<T>
  ): Promise<T> {
    const identifyJustCreated = (o: any, justCreated: boolean) => {
      const asJustCreated = o as IHasJustCreatedIdentifier;
      asJustCreated.justCreated = justCreated;
    };
    return this.identifySnowflake(
      await this.createEntityWhenNotFound(
        type,
        async () => {
          const appliedQuery = {
            ...this.getSnowFlakeQuery(snowflake),
            ...query,
          };
          const found = await type.findOne(appliedQuery);
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
    type: TClassRepository<T>,
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

  public OSU_USERS = new OsuUserGetter(this);
}

interface IDatabaseGetterGetOnly<
  K extends IHasSnowFlakeID,
  T extends SnowFlakeIDEntity
> {
  findOne(key: K | Snowflake): Promise<T>;
}

interface IDatabaseGetterGetAllOnly<T extends SnowFlakeIDEntity> {
  find(query?: FindManyOptions<T>): Promise<T[]>;
}

interface IDatabaseGetter<
  K extends IHasSnowFlakeID,
  T extends SnowFlakeIDEntity
> extends IDatabaseGetterGetOnly<K, T>,
    IDatabaseGetterGetAllOnly<T> {}

abstract class BaseDatabaseGetter<T extends SnowFlakeIDEntity> {
  protected abstract typeObject(): TClassRepository<T>;
  protected typeObjectConst: TClassRepository<T>;

  protected db: FurudeDB;
  protected cache: CacheCollection<Snowflake, T>;

  protected cacheLimit() {
    return 100;
  }

  protected cacheHours() {
    return 1;
  }

  public constructor(db: FurudeDB) {
    this.db = db;
    this.typeObjectConst = this.typeObject();
    this.cache = new CacheCollection(
      this.cacheLimit(),
      hoursToSeconds(this.cacheHours()),
      this.typeObjectConst.name
    );
  }

  protected static addCache<T extends SnowFlakeIDEntity>(
    that: BaseDatabaseGetter<T>,
    entity: T
  ) {
    that.cache.set(entity.s_id, entity);
  }

  protected static async findOne<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >(that: BaseDatabaseGetter<T>, key: K): Promise<T> {
    let entity: T;
    if (that.cache.has(key.id)) {
      entity = that.cache.get(key.id)!;
    } else {
      entity = await that.db.getSnowflake(key, that.typeObjectConst);
      this.addCache(that, entity);
    }
    return entity;
  }

  protected static async find<T extends SnowFlakeIDEntity>(
    that: BaseDatabaseGetter<T>,
    query?: FindManyOptions<T>
  ): Promise<T[]> {
    const entities = await that.db.getSnowflakes(that.typeObjectConst, query);
    for (const entity of entities) {
      this.addCache(that, entity);
    }
    return entities;
  }
}

abstract class DatabaseGetterGetOnly<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >
  extends BaseDatabaseGetter<T>
  implements IDatabaseGetterGetOnly<K, T>
{
  public async findOne(key: K): Promise<T> {
    return await BaseDatabaseGetter.findOne(this, key);
  }
}

abstract class DatabaseGetter<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >
  extends BaseDatabaseGetter<T>
  implements IDatabaseGetter<K, T>
{
  public async findOne(key: K): Promise<T> {
    return await BaseDatabaseGetter.findOne(this, key);
  }
  public async find(query?: FindManyOptions<T>): Promise<T[]> {
    return await BaseDatabaseGetter.find(this, query);
  }
}

abstract class UserBasedDatabaseGetter<
  T extends SnowFlakeIDEntity
> extends DatabaseGetter<User, T> {
  public override async findOne(user: User): Promise<T> {
    return super.findOne(user);
  }
  public override async find(query?: FindManyOptions<T>): Promise<T[]> {
    return super.find(query);
  }
}

class UserGetter extends UserBasedDatabaseGetter<DBUser> {
  protected typeObject(): TClassRepository<DBUser> {
    return DBUser;
  }

  public override cacheLimit(): number {
    return 1000;
  }
}

class CitizenGetter extends UserBasedDatabaseGetter<DBCitizen> {
  protected typeObject(): TClassRepository<DBCitizen> {
    return DBCitizen;
  }
}

class OsuUserGetter extends UserBasedDatabaseGetter<DBOsuPlayer> {
  protected typeObject(): TClassRepository<DBOsuPlayer> {
    return DBOsuPlayer;
  }
}

class GuildGetter extends DatabaseGetterGetOnly<Guild, DBGuild> {
  protected typeObject(): TClassRepository<DBGuild> {
    return DBGuild;
  }
}

class ChannelGetter extends DatabaseGetter<GuildChannel, DBChannel> {
  protected typeObject(): TClassRepository<DBChannel> {
    return DBChannel;
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
  OsuUserGetter,
  IDatabaseGetter,
  IDatabaseGetterGetAllOnly,
  IDatabaseGetterGetOnly,
};
