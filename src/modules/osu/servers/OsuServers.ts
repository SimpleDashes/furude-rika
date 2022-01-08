import BanchoServer from './implementations/bancho/BanchoServer';
import DroidServer from './implementations/droid/DroidServer';
import OsuServer from './OsuServer';

export default class OsuServers {
  public static bancho: BanchoServer;
  public static droid: DroidServer;
  public static servers: OsuServer<any, any, any, any>[] = [];

  public static build(options: { bancho_api_key: string }) {
    this.bancho = this.addServer(new BanchoServer(options.bancho_api_key));
    this.droid = this.addServer(new DroidServer());
  }

  private static addServer<S extends OsuServer<any, any, any, any>>(
    server: S
  ): S {
    this.servers.push(server);
    return server;
  }
}
