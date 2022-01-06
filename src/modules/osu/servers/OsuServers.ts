import Bancho from './bancho/Bancho';

export default class OsuServers {
  public readonly bancho;

  public constructor(options: { bancho_api_key: string }) {
    this.bancho = new Bancho(options.bancho_api_key);
  }
}
