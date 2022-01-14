import assert from 'assert';
import BanchoServer from '../modules/osu/servers/implementations/bancho/BanchoServer';
import DroidServer from '../modules/osu/servers/implementations/droid/DroidServer';
import type { AnyServer } from '../modules/osu/servers/OsuServers';
import OsuServers from '../modules/osu/servers/OsuServers';

export type OsuServerSwitcher<S extends AnyServer, T> = { (server: S): T };

export interface IServerSwitchListeners<T> {
  onBancho: OsuServerSwitcher<BanchoServer, T>;
  onDroid: OsuServerSwitcher<DroidServer, T>;
}

export default class OsuServerUtils {
  public static switchServer<S extends AnyServer>(
    server: S,
    listeners: IServerSwitchListeners<void>
  ): void {
    switch (server.name) {
      case OsuServers.bancho.name:
        assert(server instanceof BanchoServer);
        listeners.onBancho(server);
        break;
      case OsuServers.droid.name:
        assert(server instanceof DroidServer);
        listeners.onDroid(server);
        break;
    }
  }

  public static switchForParams<S extends AnyServer, T>(
    params: T,
    server: S,
    listeners: IServerSwitchListeners<T>
  ): T {
    this.switchServer(server, {
      onBancho: (s) => {
        params = listeners.onBancho(s);
      },
      onDroid: (s) => {
        params = listeners.onDroid(s);
      },
    });
    return params;
  }
}
