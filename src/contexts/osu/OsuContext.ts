import type { User } from 'discord.js';
import DBUserOsu from '../../database/entity/discord/user/DBUserOsu';
import type DBUser from '../../database/entity/discord/user/DBUser';
import DefaultContext, { UsersCreator } from '../DefaultContext';

class OsuUserCreator extends UsersCreator {
  public override async create(arg: User): Promise<DBUser> {
    const user = await this.context.db.USER.findOne(arg, {
      relations: ['osuPlayer'],
    });
    user.osuPlayer ??= new DBUserOsu(user);
    return user;
  }
}
export default class OsuContext<A> extends DefaultContext<A> {
  public override USERS: UsersCreator = new OsuUserCreator(this);
}
