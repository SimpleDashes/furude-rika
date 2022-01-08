import { Column, Entity } from 'typeorm';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import OsuServer from '../../modules/osu/servers/OsuServer';
import OsuServers from '../../modules/osu/servers/OsuServers';
import BanchoUser from '../../modules/osu/users/BanchoUser';
import IOsuUser from '../../modules/osu/users/IOsuUser';
import FurudeOperations from '../FurudeOperations';
import IDatabaseOperation from '../interfaces/IDatabaseOperation';
import HyperNumber from '../objects/hypervalues/HyperNumber';
import SnowFlakeIDEntity from './abstracts/SnowFlakeIDEntity';

interface IOsuAccounts {
  bancho: any;
}

interface IArgOsuAccounts extends IOsuAccounts {
  bancho: BanchoUser;
}
class OsuServerHyperValue extends HyperNumber<OsuServer<any, any, any, any>> {
  public getLocalDecorationKey(key: OsuServer<any, any, any, any>): string {
    return key.name;
  }
}

@Entity()
export default class DBOsuPlayer extends SnowFlakeIDEntity {
  @Column((_type) => OsuServerHyperValue)
  accounts: OsuServerHyperValue = new OsuServerHyperValue();

  public getAccount(server: OsuServer<any, any, any, any>): number {
    let account: number | null | undefined;
    if (server == OsuServers.bancho) {
      account = this.accounts.global;
    } else {
      account = this.accounts.currentLocal(server);
    }
    return account ?? 0;
  }

  public addAccounts(
    accounts: Partial<IArgOsuAccounts>,
    localizer: FurudeLocales
  ): IDatabaseOperation {
    const dbNewAccounts = {} as Record<string, number> & OsuServerHyperValue;
    const tToAddAccounts = accounts as Record<string, IOsuUser>;
    for (const o in tToAddAccounts) {
      if (o == OsuServers.bancho.name) {
        dbNewAccounts.global = tToAddAccounts[o]!.user_id;
      } else {
        dbNewAccounts[o] = tToAddAccounts[o]!.user_id;
      }
    }
    Object.assign(this.accounts, dbNewAccounts);
    return FurudeOperations.success(
      localizer.get(FurudeTranslationKeys.OSU_USER_ADDED_ACCOUNT, [
        MessageCreator.block(
          Object.values(tToAddAccounts)
            .map((a) => a.username)
            .toString()
        ),
        MessageCreator.block(Object.keys(accounts).toString()),
      ])
    );
  }
}
