import type { User } from 'discord.js';
import DBCitizen from '../../database/entity/DBCitizen';
import type DBUser from '../../database/entity/user/DBUser';
import DefaultContext, { UsersCreator } from '../DefaultContext';

class CurrencyUserCreator extends UsersCreator {
  public override async create(arg: User): Promise<DBUser> {
    const user = await this.context.db.USER.findOne(arg, {
      relations: ['citizen'],
    });
    user.citizen ??= new DBCitizen(user);
    return user;
  }
}

export default class CurrencyContext<A> extends DefaultContext<A> {
  public override USERS: UsersCreator = new CurrencyUserCreator(this);
}
