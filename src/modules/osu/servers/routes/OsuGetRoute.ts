import IGetter from '../../../connection/apis/http/IGetter';
import APIRoute from '../../../connection/apis/routes/APIRoute';
import APISubRoute from '../../../connection/apis/routes/APISubRoute';
import IBanchoOsuParam from '../implementations/bancho/params/IBanchoOsuParam';
import axios from 'axios';
import TBanchoApiRawResponse from '../implementations/bancho/interfaces/TBanchoApiRawResponse';

export default abstract class OsuGetRoute<T, B, P>
  extends APISubRoute<APIRoute<IBanchoOsuParam>>
  implements IGetter<T | undefined, P>
{
  /**
   *
   * @param params The osu!params for this method
   * @returns undefined when not found, else the requested object.
   */
  abstract get(params?: P | Partial<P>): Promise<T | undefined>;

  public async getResponse(params?: P | Partial<P>): Promise<any> {
    return (await axios.get(this.build(params))).data;
  }

  public async getFirstResultElseUndefined(
    buildT: (res: TBanchoApiRawResponse<B>) => T,
    params?: P | Partial<P>
  ): Promise<T | undefined> {
    const res = (await this.getResponse(params)) as TBanchoApiRawResponse<B>;
    return res.length > 0 ? buildT(res) : undefined;
  }
}
