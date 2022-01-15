import { hoursToSeconds } from 'date-fns';
import type { Guild, GuildChannel, Snowflake, User } from 'discord.js';
import type {
  BaseEntity,
  Connection,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { createConnection } from 'typeorm';
import { CacheCollection } from '../client/managers/abstracts/BaseFurudeCacheManager';
import { assertDefined } from '../modules/framework/types/TypeAssertions';
import type SnowFlakeIDEntity from './entity/abstracts/SnowFlakeIDEntity';
import DBChannel from './entity/DBChannel';
import DBCitizen from './entity/DBCitizen';
import DBGuild from './entity/DBGuild';
import DBOsuPlayer from './entity/DBOsuPlayer';
import DBUser from './entity/DBUser';
import type IHasJustCreatedIdentifier from './interfaces/IHasJustCreatedIdentifier';
import type IHasSnowFlakeID from './interfaces/IHasSnowFlakeID';
import type { ClassRepository } from './types/ClassRepository';

export default class FurudeDB {
  public readonly uri: string;
  #connection?: Connection;

  public get Connection(): Connection | undefined {
    return this.#connection;
  }

  public constructor() {
    this.uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@furude.9zjpv.mongodb.net/furude?retryWrites=true&w=majority`;
  }

  public async connect(): Promise<void> {
    this.#connection = await createConnection({
      type: 'mongodb',
      url: this.uri,
      useNewUrlParser: true,
      synchronize: false,
      logging: true,
      useUnifiedTopology: true,
      entities: ['dist/database/entity/*.js'],
    });
  }

  #assignNewEntityToEntity<T extends BaseEntity>(
    constructor: ClassRepository<T>,
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

  async #createEntityWhenNotFound<T extends BaseEntity>(
    constructor: ClassRepository<T>,
    findEntity: () => Promise<T | undefined>,
    onNotFound?: (o: T) => void
  ): Promise<T> {
    let find: T | null = null;
    try {
      const found = await findEntity();
      if (found) {
        find = found;
      }
    } catch {
      // We use a new entity if the entity isn't found.
    }
    return this.#assignNewEntityToEntity(constructor, find, onNotFound);
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

  #identifySnowflake<T extends SnowFlakeIDEntity>(
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
    type: ClassRepository<T>,
    query?: FindOneOptions<T>
  ): Promise<T> {
    const identifyJustCreated = (
      o: IHasJustCreatedIdentifier,
      justCreated: boolean
    ): void => {
      o.justCreated = justCreated;
    };
    return this.#identifySnowflake(
      await this.#createEntityWhenNotFound(
        type,
        async () => {
          const appliedQuery = {
            ...this.getSnowFlakeQuery(snowflake),
            ...query,
          };
          const found = await type.findOne(appliedQuery);
          assertDefined(found);
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
    type: ClassRepository<T>,
    query?: FindManyOptions<T>
  ): Promise<T[]> {
    const snowFlakes: T[] = await type.find(query);
    for (const snowFlake of snowFlakes) {
      this.#assignNewEntityToEntity(type, snowFlake);
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
  findOne: (key: K | Snowflake) => Promise<T>;
}

interface IDatabaseGetterGetAllOnly<T extends SnowFlakeIDEntity> {
  find: (query?: FindManyOptions<T>) => Promise<T[]>;
}

interface IDatabaseGetter<
  K extends IHasSnowFlakeID,
  T extends SnowFlakeIDEntity
> extends IDatabaseGetterGetOnly<K, T>,
    IDatabaseGetterGetAllOnly<T> {}

abstract class BaseDatabaseGetter<T extends SnowFlakeIDEntity> {
  protected abstract typeObject(): ClassRepository<T>;
  protected typeObjectConst: ClassRepository<T>;

  protected db: FurudeDB;
  protected cache: CacheCollection<Snowflake, T>;

  protected cacheLimit(): number {
    return 100;
  }

  protected cacheHours(): number {
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
  ): void {
    that.cache.set(entity.s_id, entity);
  }

  protected static async findOne<
    K extends IHasSnowFlakeID | Snowflake,
    T extends SnowFlakeIDEntity
  >(that: BaseDatabaseGetter<T>, key: K): Promise<T> {
    const newKey: IHasSnowFlakeID = {
      id: typeof key === 'string' ? key : key.id,
    };
    let entity = that.cache.get(newKey.id);
    if (!entity) {
      entity = await that.db.getSnowflake(newKey, that.typeObjectConst);
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
  public async findOne(key: K | Snowflake): Promise<T> {
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
  public async findOne(key: K | Snowflake): Promise<T> {
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
  protected typeObject(): ClassRepository<DBUser> {
    return DBUser;
  }

  public override cacheLimit(): number {
    return 1000;
  }
}

class CitizenGetter extends UserBasedDatabaseGetter<DBCitizen> {
  protected typeObject(): ClassRepository<DBCitizen> {
    return DBCitizen;
  }
}

class OsuUserGetter extends UserBasedDatabaseGetter<DBOsuPlayer> {
  protected typeObject(): ClassRepository<DBOsuPlayer> {
    return DBOsuPlayer;
  }
}

class GuildGetter extends DatabaseGetterGetOnly<Guild, DBGuild> {
  protected typeObject(): ClassRepository<DBGuild> {
    return DBGuild;
  }
}

class ChannelGetter extends DatabaseGetter<GuildChannel, DBChannel> {
  protected typeObject(): ClassRepository<DBChannel> {
    return DBChannel;
  }
}

export type {
  IDatabaseGetter,
  IDatabaseGetterGetAllOnly,
  IDatabaseGetterGetOnly,
};
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
};
