import IBanchoAPIUserResponse from '../../bancho/interfaces/IBanchoAPIUserResponse';
import TBanchoApiRawResponse from '../../bancho/interfaces/TBanchoApiRawResponse';
import BanchoUser from '../../bancho/objects/BanchoUser';

interface IDroidUserExtension {
  html?: string;
}

export default class DroidUser
  extends BanchoUser
  implements IDroidUserExtension
{
  html?: string;

  public constructor(
    raw_res: TBanchoApiRawResponse<IBanchoAPIUserResponse>,
    droid: IDroidUserExtension = {}
  ) {
    super(raw_res);
    this.html = droid.html;
  }
}
