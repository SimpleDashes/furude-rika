import { User } from 'discord.js';
import DBCitizen from '../../../database/entity/DBCitizen';
import DefaultContext, { UserBasedContextCreator } from '../DefaultContext';

class CitizenCreator extends UserBasedContextCreator<
  CurrencyContext,
  DBCitizen
> {
  public async create(arg: User): Promise<DBCitizen> {
    return this.context.db.CITIZEN.findOne(arg);
  }
  public default(arg: User): Promise<DBCitizen> {
    return this.userDefault(arg, this.context.citizen);
  }
}
export default class CurrencyContext extends DefaultContext {
  public citizen!: DBCitizen;

  public override async build(): Promise<void> {
    await super.build();
    this.citizen = await this.CITIZENS.create(this.interaction.user);
  }

  public CITIZENS = new CitizenCreator(this);
}
