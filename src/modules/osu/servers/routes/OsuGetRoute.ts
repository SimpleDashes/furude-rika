import IGetter from '../../../connection/apis/http/IGetter';
import APIRoute from '../../../connection/apis/routes/APIRoute';
import APISubRoute from '../../../connection/apis/routes/APISubRoute';
import IBanchoOsuParam from '../bancho/params/IBanchoOsuParam';
import axios from 'axios';
import TOsuApiRawResponse from '../../users/response/TOsuApiRawResponse';

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

  public async getFirstResultElseUndefined(
    buildT: (res: TOsuApiRawResponse<B>) => T,
    params?: P | Partial<P>
  ): Promise<T | undefined> {
    const res = (await axios.get(this.build(params)))
      .data as TOsuApiRawResponse<B>;
    return res.length > 0 ? buildT(res) : undefined;
  }
}
