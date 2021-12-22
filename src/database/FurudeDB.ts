import { User } from 'discord.js';
import {
  BaseEntity,
  Connection,
  createConnection,
  FindOneOptions,
} from 'typeorm';
import Constructor from '../framework/interfaces/Constructor';
import DiscordUser from './entity/DiscordUser';
import { FurudeUser } from './entity/FurudeUser';

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

  public async createEntityWhenNotFound<T extends BaseEntity>(
    constructor: Constructor<T>,
    findEntity: () => Promise<T | undefined>
  ) {
    let find: T | null = null;
    try {
      const found = await findEntity();
      if (found) {
        find = found;
      }
    } catch {}
    find = find ?? new constructor();
    return find;
  }

  public getDiscordUserQuery(user: User): FindOneOptions<any> {
    return {
      where: {
        id: user.id,
      },
    };
  }

  public identifyDiscordUser<T extends DiscordUser>(entity: T, user: User): T {
    if (!entity.id) {
      entity.id = user.id;
    }
    return entity;
  }

  public async getFurudeUser(user: User): Promise<FurudeUser> {
    return this.identifyDiscordUser(
      await this.createEntityWhenNotFound(
        FurudeUser,
        async () => await FurudeUser.findOne(this.getDiscordUserQuery(user))
      ),
      user
    );
  }

  /**
   * Manipulates an object then saves it right after
   */
  public async manipulate<T extends BaseEntity>(
    object: T,
    manipulator: (object: T) => void
  ) {
    await manipulator(object);
    await object.save();
  }
}
