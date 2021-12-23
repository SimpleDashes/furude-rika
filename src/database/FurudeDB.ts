import { Guild, User } from 'discord.js';
import {
  BaseEntity,
  Connection,
  createConnection,
  FindOneOptions,
} from 'typeorm';
import Constructor from '../framework/interfaces/Constructor';
import SnowFlakeIDEntity from './entity/abstracts/SnowFlakeIDEntity';
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
      synchronize: true,
      logging: true,
      useUnifiedTopology: true,
      entities: ['dist/database/entity/*.js'],
    });
  }

  private async createEntityWhenNotFound<T extends BaseEntity>(
    constructor: Constructor<T>,
    findEntity: () => Promise<T>
  ) {
    let find: T | null = null;
    try {
      const found = await findEntity();
      if (found) {
        find = found;
      }
    } catch {}
    const entity = new constructor();
    Object.assign(entity, find);
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

  public async getUser(user: User): Promise<DBUser> {
    return this.identifySnowflake(
      await this.createEntityWhenNotFound(
        DBUser,
        async () => await DBUser.findOne(this.getSnowFlakeQuery(user))
      ),
      user
    );
  }

  public async getGuild(guild: Guild): Promise<DBGuild> {
    return this.identifySnowflake(
      await this.createEntityWhenNotFound(
        DBGuild,
        async () => await DBGuild.findOne(this.getSnowFlakeQuery(guild))
      ),
      guild
    );
  }

  /**
   * Manipulates an object then saves it right after
   */
  public async manipulate<T extends BaseEntity>(
    object: T,
    manipulator: (object: T) => void
  ) {
    manipulator(object);
    await object.save();
  }
}
