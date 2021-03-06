import { assertDefined, assertDefinedGet } from 'discowork';
import { Entity, Column, OneToOne } from 'typeorm';
import type OsuContext from '../../../../contexts/osu/OsuContext';
import type BanchoUser from '../../../../modules/osu/servers/implementations/bancho/objects/BanchoUser';
import type { AnyServer } from '../../../../modules/osu/servers/OsuServers';
import OsuServers from '../../../../modules/osu/servers/OsuServers';
import type IOsuUser from '../../../../modules/osu/users/IOsuUser';
import MessageCreator from '../../../../utils/MessageCreator';
import FurudeOperations from '../../../FurudeOperations';
import type IDatabaseOperation from '../../../interfaces/IDatabaseOperation';
import HyperNumber from '../../../objects/hypervalues/HyperNumber';
import SnowFlakeIDEntity from '../../abstracts/SnowFlakeIDEntity';
import DBUser from './DBUser';

interface IOsuAccounts {
  bancho: unknown;
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
export default class DBUserOsu extends SnowFlakeIDEntity {
  @OneToOne(() => DBUser, (user) => user.osuPlayer)
  public user!: DBUser;

  @Column(() => OsuServerHyperValue)
  public accounts: OsuServerHyperValue = new OsuServerHyperValue();

  @Column('string', { nullable: true })
  public preferredServer?: string;

  public constructor(user: DBUser) {
    super();
    if (user) {
      this.user = user;
      this.id = user.id;
    }
  }

  public setPreferredServer(
    context: OsuContext<unknown>,
    server: AnyServer
  ): IDatabaseOperation {
    const { client } = context;
    const { localizer } = client;

    console.log(this.preferredServer);

    if (this.preferredServer === server.name) {
      return FurudeOperations.error(
        localizer.getTranslationFromContext(
          context,
          (k) => k.osu.preferred_server.already_prefer_this_server,
          {}
        )
      );
    }

    this.preferredServer = server.name;

    return FurudeOperations.success(
      localizer.getTranslationFromContext(
        context,
        (k) => k.osu.preferred_server.changed,
        { OSU_SERVER: MessageCreator.block(this.preferredServer) }
      )
    );
  }

  public getAccount(server: AnyServer): number {
    let account: number | null | undefined;
    if (server === OsuServers.bancho) {
      account = this.accounts.global;
    } else {
      account = this.accounts.currentLocal(server);
    }
    return account ?? 0;
  }

  public addAccounts(
    context: OsuContext<unknown>,
    accounts: Partial<IArgOsuAccounts>
  ): IDatabaseOperation {
    const { client } = context;
    const { localizer } = client;

    const dbNewAccounts = new OsuServerHyperValue();
    const tToAddAccounts = accounts as Record<string, IOsuUser<unknown>>;

    for (const o in tToAddAccounts) {
      const tToAddAccount = tToAddAccounts[o];
      assertDefined(tToAddAccount);
      if (o === OsuServers.bancho.name) {
        dbNewAccounts.global = tToAddAccount.user_id;
      } else {
        const server = OsuServers.servers.find((s) => s.name === o);
        if (server) {
          dbNewAccounts.setLocal(server, tToAddAccount.user_id);
        }
      }
    }

    if (dbNewAccounts.global) {
      this.accounts.global = dbNewAccounts.global;
    }

    for (const key in dbNewAccounts.locals) {
      const server = OsuServers.servers.find((s) => s.name === key);
      assertDefined(server);
      this.accounts.setLocal(
        server,
        assertDefinedGet(dbNewAccounts.locals[key])
      );
    }

    return FurudeOperations.success(
      localizer.getTranslationFromContext(context, (k) => k.osu.account.added, {
        USERNAME: MessageCreator.block(
          Object.values(tToAddAccounts)
            .map((a) => a.username)
            .toString()
        ),
        OSU_SERVER: MessageCreator.block(Object.keys(accounts).toString()),
      })
    );
  }
}
