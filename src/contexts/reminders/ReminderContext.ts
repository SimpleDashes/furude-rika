import type { User } from 'discord.js';
import type DBUser from '../../database/entity/user/DBUser';
import DefaultContext, { UsersCreator } from '../DefaultContext';

class ReminderUserCreator extends UsersCreator {
  public override async create(arg: User): Promise<DBUser> {
    return await this.context.db.USER.findOne(arg, {
      relations: ['reminders'],
    });
  }
}

export default class ReminderContext<A> extends DefaultContext<A> {
  public override USERS: UsersCreator = new ReminderUserCreator(this);
}
