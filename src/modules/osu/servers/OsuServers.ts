import BanchoServer from './implementations/bancho/BanchoServer';
import DroidServer from './implementations/droid/DroidServer';
import OsuServer from './OsuServer';

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

  public static build(options: { bancho_api_key: string }) {
    this.bancho = this.addServer(new BanchoServer(options.bancho_api_key));
    this.droid = this.addServer(new DroidServer());
  }

  private static addServer<S extends AnyServer>(server: S): S {
    this.servers.push(server);
    return server;
  }
}
