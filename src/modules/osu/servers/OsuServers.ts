import BanchoServer from './implementations/bancho/BanchoServer';
import DroidServer from './implementations/droid/DroidServer';
import type OsuServer from './OsuServer';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyServer = OsuServer<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export default class OsuServers {
  public static bancho: BanchoServer;
  public static droid: DroidServer;
  public static servers: AnyServer[] = [];

  public static build(options: { bancho_api_key: string }): void {
    this.bancho = this.#addServer(new BanchoServer(options.bancho_api_key));
    this.droid = this.#addServer(new DroidServer());
  }

  static #addServer<S extends AnyServer>(server: S): S {
    this.servers.push(server);
    return server;
  }
}
