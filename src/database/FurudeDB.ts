import { Guild, GuildChannel, User } from 'discord.js';
import {
  BaseEntity,
  Connection,
  createConnection,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
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

abstract class BaseDatabaseGetter<T extends SnowFlakeIDEntity> {
  protected db: FurudeDB;
  protected abstract typeObject: TClassRepository<T>;

  public constructor(db: FurudeDB) {
    this.db = db;
  }

  protected static async get<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >(
    that: BaseDatabaseGetter<T>,
    key: K,
    query?: FindOneOptions<T>
  ): Promise<T> {
    return await that.db.getSnowflake(key, that.typeObject, query);
  }

  protected static async getAllOn<T extends SnowFlakeIDEntity>(
    that: BaseDatabaseGetter<T>,
    query?: FindManyOptions<T>
  ): Promise<T[]> {
    return await that.db.getSnowflakes(that.typeObject, query);
  }
}

abstract class DatabaseGetterGetOnly<
    K extends IHasSnowFlakeID,
    T extends SnowFlakeIDEntity
  >
  extends BaseDatabaseGetter<T>
  implements IDatabaseGetterGetOnly<K, T>
{
  public async get(key: K, query?: FindManyOptions<T>): Promise<T> {
    return await BaseDatabaseGetter.get(this, key, query);
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
  extends BaseDatabaseGetter<T>
  implements IDatabaseGetter<K, T>
{
  public async get(key: K, query?: FindManyOptions<T>): Promise<T> {
    return await BaseDatabaseGetter.get(this, key, query);
  }
  public async getAllOn(query?: FindManyOptions<T>): Promise<T[]> {
    return await BaseDatabaseGetter.getAllOn(this, query);
  }
}

abstract class UserBasedDatabaseGetter<
  T extends SnowFlakeIDEntity
> extends DatabaseGetter<User, T> {
  public override async get(
    user: User,
    query?: FindManyOptions<T>
  ): Promise<T> {
    return super.get(user, query);
  }
  public override async getAllOn(query?: FindManyOptions<T>): Promise<T[]> {
    return super.getAllOn(query);
  }
}

class UserGetter extends UserBasedDatabaseGetter<DBUser> {
  protected typeObject: TClassRepository<DBUser> = DBUser;
}

class CitizenGetter extends UserBasedDatabaseGetter<DBCitizen> {
  protected typeObject: TClassRepository<DBCitizen> = DBCitizen;
}

class OsuUserGetter extends UserBasedDatabaseGetter<DBOsuPlayer> {
  protected typeObject: TClassRepository<DBOsuPlayer> = DBOsuPlayer;
}

class GuildGetter extends DatabaseGetterGetOnly<Guild, DBGuild> {
  protected typeObject: TClassRepository<DBGuild> = DBGuild;
}

class ChannelGetter extends DatabaseGetter<GuildChannel, DBChannel> {
  protected typeObject: TClassRepository<DBChannel> = DBChannel;
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
