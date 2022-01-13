import type { User } from 'discord.js';
import type DBOsuPlayer from '../../../database/entity/DBOsuPlayer';
import DefaultContext, { UserBasedContextCreator } from '../DefaultContext';

class OsuUserCreator extends UserBasedContextCreator<OsuContext, DBOsuPlayer> {
  public async create(arg: User): Promise<DBOsuPlayer> {
    return this.context.db.OSU_USERS.findOne(arg);
  }
  public default(arg: User): Promise<DBOsuPlayer> {
    return this.userDefault(arg, this.context.osuPlayer);
  }
}
export default class OsuContext extends DefaultContext {
  public osuPlayer!: DBOsuPlayer;

  public override async build(): Promise<void> {
    await super.build();
    this.osuPlayer = await this.OSU_PLAYER.create(this.interaction.user);
  }

  public OSU_PLAYER = new OsuUserCreator(this);
}
