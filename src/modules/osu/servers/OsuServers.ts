import IOsuScore from '../scores/IOsuScore';
import IOsuUser from '../users/IOsuUser';
import IAPIOsuBeatmap from './beatmaps/IAPIOsuBeatmap';
import BanchoServer from './implementations/bancho/BanchoServer';
import IBanchoAPIBeatmapResponse from './implementations/bancho/interfaces/beatmaps/IBanchoAPIBeatmapResponse';
import IBanchoAPIUserRecentScore from './implementations/bancho/interfaces/scores/IBanchoAPIUserRecentScore';
import IBanchoAPIUserResponse from './implementations/bancho/interfaces/users/IBanchoAPIUserResponse';
import DroidServer from './implementations/droid/DroidServer';
import OsuServer from './OsuServer';

export type AnyServer = OsuServer<
  unknown,
  IOsuUser<unknown>,
  IBanchoAPIUserResponse,
  unknown,
  IOsuScore,
  IBanchoAPIUserRecentScore,
  unknown,
  IAPIOsuBeatmap,
  IBanchoAPIBeatmapResponse,
  unknown
>;

export default class OsuServers {
  public static bancho: BanchoServer;
  public static droid: DroidServer;
  public static servers: AnyServer[] = [];

  public static build(options: { bancho_api_key: string }): void {
    this.bancho = this.addServer(new BanchoServer(options.bancho_api_key));
    this.droid = this.addServer(new DroidServer());
  }

  private static addServer<S extends AnyServer>(server: S): S {
    this.servers.push(server);
    return server;
  }
}
