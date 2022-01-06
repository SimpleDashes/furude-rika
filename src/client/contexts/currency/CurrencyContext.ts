import { User } from 'discord.js';
import DBUser from '../../../database/entity/DBUser';
import DefaultContext, { UsersCreator } from '../DefaultContext';

class CurrencyUserCreator extends UsersCreator {
  public override async create(arg: User): Promise<DBUser> {
    const user = await super.create(arg);
    user.citizen = await this.context.db.CITIZEN.get(arg);
    return user;
  }
}
export default class CurrencyContext extends DefaultContext {
  protected override async build(): Promise<void> {
    await super.build();
  }

  public override USERS: UsersCreator = new CurrencyUserCreator(this);
}
