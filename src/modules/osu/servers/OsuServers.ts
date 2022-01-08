import Bancho from './bancho/Bancho';
import OsuServer from './OsuServer';

export default class OsuServers {
  public static bancho: Bancho;
  public static servers: OsuServer<any, any, any, any>[] = [];

  public static build(options: { bancho_api_key: string }) {
    this.bancho = this.addServer(new Bancho(options.bancho_api_key));
  }

  private static addServer<S extends OsuServer<any, any, any, any>>(
    server: S
  ): S {
    this.servers.push(server);
    return server;
  }
}
