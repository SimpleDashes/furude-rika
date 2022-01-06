import { Column, Entity } from 'typeorm';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';

class OsuAccounts {
  bancho: number = 0;
}

@Entity()
export default class DBOsuPlayer extends SnowFlakeIDEntity {
  @Column((_type) => OsuAccounts)
  accounts: OsuAccounts = new OsuAccounts();

  public addAccounts(accounts: Partial<OsuAccounts>) {
    this.accounts = { ...this.accounts, ...accounts };
  }
}
