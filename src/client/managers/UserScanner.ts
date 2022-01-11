import DBUser from '../../database/entity/DBUser';
import consola from 'consola';
import BaseFurudeScanner from './abstracts/BaseFurudeScanner';

export default class UserScanner extends BaseFurudeScanner {
  protected scanningWhat: string = 'USER';

  protected async runScan(): Promise<void> {
    const users = await this.rika.db.USER.find();
    for (const dbUser of users) {
      let discordUser;
      try {
        discordUser = await this.rika.users.fetch(dbUser.s_id);
      } catch {
        return;
      }
      dbUser.setUsername(discordUser.username);
      consola.success(
        `Dumped data about the user: ${dbUser.username} with the id: ${dbUser.s_id}`
      );
    }
    DBUser.save(users);
  }
}
