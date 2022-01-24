import DBUser from '../database/entity/DBUser';
import BaseFurudeScanner from './abstracts/BaseFurudeScanner';
import { Logger } from 'discowork';

export default class UserScanner extends BaseFurudeScanner {
  protected scanningWhat = 'USER';

  protected async runScan(): Promise<void> {
    const users = await this.rika.db.USER.find();
    for (const dbUser of users) {
      let discordUser;
      try {
        discordUser = await this.rika.users.fetch(dbUser.s_id);
      } catch {
        continue;
      }
      dbUser.setUsername(discordUser.username);
      Logger.success(
        `Dumped data about the user: ${dbUser.username} with the id: ${dbUser.s_id}`
      );
    }
    await DBUser.save(users);
  }
}
