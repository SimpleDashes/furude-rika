import { Column, Entity } from 'typeorm';
import FurudeLocales from '../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import OsuServers, { AnyServer } from '../../modules/osu/servers/OsuServers';
import BanchoUser from '../../modules/osu/servers/implementations/bancho/objects/BanchoUser';
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
class OsuServerHyperValue extends HyperNumber<AnyServer> {
  public getLocalDecorationKey(key: AnyServer): string {
    return key.name;
  }
}

@Entity()
export default class DBOsuPlayer extends SnowFlakeIDEntity {
  @Column((_type) => OsuServerHyperValue)
  accounts: OsuServerHyperValue = new OsuServerHyperValue();

  public getAccount(server: AnyServer): number {
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
    const dbNewAccounts = new OsuServerHyperValue();
    const tToAddAccounts = accounts as Record<string, IOsuUser<any>>;
    for (const o in tToAddAccounts) {
      if (o == OsuServers.bancho.name) {
        dbNewAccounts.global = tToAddAccounts[o]!.user_id;
      } else {
        const server = OsuServers.servers.find((s) => s.name == o);
        if (server) {
          dbNewAccounts.setLocal(server, tToAddAccounts[o]!.user_id);
        }
      }
    }
    if (dbNewAccounts.global) {
      this.accounts.global = dbNewAccounts.global;
    }
    for (const o of dbNewAccounts.locals) {
      this.accounts.setLocal(
        OsuServers.servers.find((s) => s.name == o.key)!,
        o.value
      );
    }
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
