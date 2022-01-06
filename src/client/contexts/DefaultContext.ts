import { Guild, GuildChannel, User } from 'discord.js';
import DBChannel from '../../database/entity/DBChannel';
import DBGuild from '../../database/entity/DBGuild';
import DBUser from '../../database/entity/DBUser';
import FurudeLocales from '../../localization/FurudeLocales';
import BaseContext from './BaseContext';

export abstract class ContextCreator<C extends DefaultContext, P, T> {
  protected context: C;
  public constructor(context: C) {
    this.context = context;
  }
  public abstract create(arg: P): Promise<T>;
  public abstract default(arg: P): Promise<T>;

  protected async baseDefault(arg: P, equals: P, defaultValue: T): Promise<T> {
    return arg == equals ? defaultValue : await this.create(arg);
  }
}

abstract class DefaultContextCreator<P, T> extends ContextCreator<
  DefaultContext,
  P,
  T
> {}

export class UsersCreator extends DefaultContextCreator<User, DBUser> {
  public async create(arg: User): Promise<DBUser> {
    return await this.context.db.USER.get(arg);
  }
  public async default(arg: User): Promise<DBUser> {
    return this.baseDefault(
      arg,
      this.context.runner.interaction.user,
      this.context.dbUser
    );
  }
}

export class GuildCreator extends DefaultContextCreator<Guild, DBGuild> {
  public async create(arg: Guild): Promise<DBGuild> {
    return await this.context.db.GUILD.get(arg);
  }
  public async default(arg: Guild): Promise<DBGuild> {
    return this.baseDefault(
      arg,
      this.context.runner.interaction.guild!,
      this.context.dbGuild!
    );
  }
}

export class ChannelCreator extends DefaultContextCreator<
  GuildChannel,
  DBChannel
> {
  public async create(arg: GuildChannel): Promise<DBChannel> {
    return await this.context.db.CHANNEL.get(arg);
  }
  public async default(arg: GuildChannel): Promise<DBChannel> {
    return this.baseDefault(
      arg,
      this.context.runner.interaction.channel as GuildChannel,
      this.context.dbChannel!
    );
  }
}

export default class DefaultContext extends BaseContext {
  public localizer!: FurudeLocales;
  public dbUser!: DBUser;
  public dbGuild?: DBGuild;
  public dbChannel?: DBChannel;

  protected async build(): Promise<void> {
    this.localizer = this.createLocalizer();
    this.dbUser = await this.USERS.create(this.runner.interaction.user);
    if (this.runner.interaction.inGuild()) {
      this.dbGuild = await this.GUILDS.create(this.runner.interaction.guild!);
      this.dbChannel = await this.CHANNELS.create(
        this.runner.interaction.channel as GuildChannel
      );
    }
  }

  public USERS = new UsersCreator(this);

  public GUILDS = new GuildCreator(this);

  public CHANNELS = new ChannelCreator(this);

  protected createLocalizer(): FurudeLocales {
    return new FurudeLocales({ runner: this.runner });
  }
}
