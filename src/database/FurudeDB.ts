import type { Guild, GuildChannel, Snowflake, User } from 'discord.js';
import type {
  BaseEntity,
  Connection,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { createConnection } from 'typeorm';
import type SnowFlakeIDEntity from './entity/abstracts/SnowFlakeIDEntity';
import DBChannel from './entity/DBChannel';
import DBGuild from './entity/DBGuild';
import DBOsuPlayer from './entity/user/DBOsuPlayer';
import DBUser from './entity/user/DBUser';
import type IHasSnowFlakeID from './interfaces/IHasSnowFlakeID';
import type { ClassRepository } from './types/ClassRepository';
import InMemoryCacheProvider from 'typeorm-in-memory-cache';
import NodeCache from 'node-cache';
import { hoursToSeconds } from 'date-fns';

export default class FurudeDB {
  public readonly uri: string;

  #connection?: Connection;

  public get Connection(): Connection | undefined {
    return this.#connection;
  }

  public constructor() {
    this.uri = process.env.DATABASE_URL;
  }

  public async connect(): Promise<void> {
    this.#connection = await createConnection({
      type: 'cockroachdb',
      url: this.uri,
      synchronize: true,
      logging: true,
      ssl: true,
      entities: ['dist/database/entity/user/*.js', 'dist/database/entity/*.js'],
      cache: {
        provider: () => {
          const options: NodeCache = new NodeCache({});
          const provider = new InMemoryCacheProvider(options);
          const originalMethod = provider.storeInCache;
          provider.storeInCache = async function (
            options,
            savedCache
          ): Promise<void> {
            try {
              return await originalMethod
                .apply(this, [options, savedCache])
                .catch();
            } catch {
              return;
            }
          };
          return provider;
        },
        type: 'database',
        alwaysEnabled: true,
        duration: hoursToSeconds(1),
      },
    });
  }

  /**
   *
   * @param constructor The entity repository.
   * @param baseEntity The base entity to apply default values from constructor.
   * @param onNotFound What to do when there isn't a baseEntity;
   * @returns
   */
  #defaultEntity<T extends BaseEntity>(
    constructor: ClassRepository<T>,
    baseEntity: T | undefined,
    onNotFound?: (o: T) => void
  ): T {
    const entity = new constructor();
    if (baseEntity) {
      Object.assign(entity, baseEntity);
    } else if (onNotFound) {
      onNotFound(entity);
    }
    return entity;
  }

  /**
   *
   * @param constructor The entity repository.
   * @param findEntity  Function that finds the entity.
   * @param onNotFound  What to do if we can't find the entity.
   * @returns The new entity.
   */
  async #createEntityWhenNotFound<T extends BaseEntity>(
    constructor: ClassRepository<T>,
    findEntity: () => Promise<T | undefined>,
    onNotFound?: (o: T) => void
  ): Promise<T> {
    const found: T | undefined = await findEntity().catch();
    return this.#defaultEntity(constructor, found, onNotFound);
  }

  /**
   *
   * @param snowflakeable A snowflakeable entity.
   * @returns A query for that snowflakeable entity.
   */
  public getSnowFlakeQuery(
    snowflakeable: IHasSnowFlakeID
  ): FindOneOptions<SnowFlakeIDEntity> {
    return {
      where: {
        id: snowflakeable.id,
      },
    };
  }

  /**
   *
   * @param entity  A snowflakeable entity.
   * @param snowflakeable A snowflake id object to identity the entity with it's own id.
   * @returns The {@link entity}
   */
  #identifySnowflake<T extends SnowFlakeIDEntity>(
    entity: T,
    snowflakeable: IHasSnowFlakeID
  ): T {
    if (!entity.id) {
      entity.id = snowflakeable.id;
    }
    return entity;
  }

  /**
   *
   * @param snowflake A {@link IHasSnowFlakeID} to bases it id for the query.
   * @param type The repository of the snowflake entity.
   * @param query A extra query for more specific queries.
   * @returns The entity found with that query.
   */
  public async getSnowflake<T extends SnowFlakeIDEntity>(
    snowflake: IHasSnowFlakeID,
    type: ClassRepository<T>,
    query?: FindOneOptions<T>
  ): Promise<T> {
    return this.#identifySnowflake(
      await this.#createEntityWhenNotFound(type, async () => {
        const appliedQuery = {
          ...this.getSnowFlakeQuery(snowflake),
          ...query,
        };
        return await type.findOne(appliedQuery);
      }),
      snowflake
    );
  }

  /**
   *
   * @param type The entity repository.
   * @param query An extra query for more specific queries.
   * @returns Found entities with that query.
   */
  public async getSnowflakes<T extends SnowFlakeIDEntity>(
    type: ClassRepository<T>,
    query?: FindManyOptions<T>
  ): Promise<T[]> {
    const snowFlakes: T[] = await type.find(query);
    snowFlakes.forEach((snowflake) => this.#defaultEntity(type, snowflake));
    return snowFlakes;
  }

  public USER = new UserGetter(this);

  public GUILD = new GuildGetter(this);

  public CHANNEL = new ChannelGetter(this);

  public OSU_USERS = new OsuUserGetter(this);
}

export interface IDatabaseGetterGetOnly<
  K extends IHasSnowFlakeID,
  T extends SnowFlakeIDEntity
> {
  findOne: (key: K | Snowflake) => Promise<T>;
}

export interface IDatabaseGetterGetAllOnly<T extends SnowFlakeIDEntity> {
  find: (query?: FindManyOptions<T>) => Promise<T[]>;
}

export interface IDatabaseGetter<
  K extends IHasSnowFlakeID,
  T extends SnowFlakeIDEntity
> extends IDatabaseGetterGetOnly<K, T>,
    IDatabaseGetterGetAllOnly<T> {}

export abstract class BaseDatabaseGetter<T extends SnowFlakeIDEntity> {
  protected abstract typeObject(): ClassRepository<T>;

  protected db: FurudeDB;

  public constructor(db: FurudeDB) {
    this.db = db;
  }

  protected static async findOne<
    K extends IHasSnowFlakeID | Snowflake,
    T extends SnowFlakeIDEntity
  >(
    that: BaseDatabaseGetter<T>,
    key: K,
    query?: FindOneOptions<T>
  ): Promise<T> {
    const newKey: IHasSnowFlakeID = {
      id: typeof key === 'string' ? key : key.id,
    };
    return await that.db.getSnowflake<T>(newKey, that.typeObject(), query);
  }

  protected static async find<T extends SnowFlakeIDEntity>(
    that: BaseDatabaseGetter<T>,
    query?: FindManyOptions<T>
  ): Promise<T[]> {
    return await that.db.getSnowflakes(that.typeObject(), query);
  }
}

export abstract class DatabaseGetterGetOnly<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >
  extends BaseDatabaseGetter<T>
  implements IDatabaseGetterGetOnly<K, T>
{
  public async findOne(
    key: K | Snowflake,
    query?: FindOneOptions<T>
  ): Promise<T> {
    return await BaseDatabaseGetter.findOne(this, key, query);
  }
}

export abstract class DatabaseGetter<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >
  extends BaseDatabaseGetter<T>
  implements IDatabaseGetter<K, T>
{
  public async findOne(
    key: K | Snowflake,
    query?: FindOneOptions<T>
  ): Promise<T> {
    return await BaseDatabaseGetter.findOne(this, key, query);
  }
  public async find(query?: FindManyOptions<T>): Promise<T[]> {
    return await BaseDatabaseGetter.find(this, query);
  }
}

export abstract class UserBasedDatabaseGetter<
  T extends SnowFlakeIDEntity
> extends DatabaseGetter<User, T> {
  public override async findOne(
    user: User,
    query?: FindOneOptions<T>
  ): Promise<T> {
    return super.findOne(user, query);
  }
  public override async find(query?: FindManyOptions<T>): Promise<T[]> {
    return super.find(query);
  }
}

export class UserGetter extends UserBasedDatabaseGetter<DBUser> {
  protected typeObject(): ClassRepository<DBUser> {
    return DBUser;
  }
}

export class OsuUserGetter extends UserBasedDatabaseGetter<DBOsuPlayer> {
  protected typeObject(): ClassRepository<DBOsuPlayer> {
    return DBOsuPlayer;
  }
}

export class GuildGetter extends DatabaseGetterGetOnly<Guild, DBGuild> {
  protected typeObject(): ClassRepository<DBGuild> {
    return DBGuild;
  }
}

export class ChannelGetter extends DatabaseGetter<GuildChannel, DBChannel> {
  protected typeObject(): ClassRepository<DBChannel> {
    return DBChannel;
  }
}
