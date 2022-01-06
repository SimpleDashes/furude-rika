import { User } from 'discord.js';
import DBCitizen from '../../../database/entity/DBCitizen';
import DefaultContext, { ContextCreator } from '../DefaultContext';

class CitizenCreator extends ContextCreator<CurrencyContext, User, DBCitizen> {
  public async create(arg: User): Promise<DBCitizen> {
    return this.context.db.CITIZEN.get(arg);
  }
  public default(arg: User): Promise<DBCitizen> {
    return this.baseDefault(
      arg,
      this.context.runner.interaction.user,
      this.context.citizen
    );
  }
}
export default class CurrencyContext extends DefaultContext {
  public citizen!: DBCitizen;

  protected override async build(): Promise<void> {
    await super.build();
    this.citizen = await this.CITIZENS.create(this.runner.interaction.user);
  }

  public CITIZENS = new CitizenCreator(this);
}
