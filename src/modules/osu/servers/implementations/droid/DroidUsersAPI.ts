import IBanchoAPIUserResponse from '../bancho/interfaces/users/IBanchoAPIUserResponse';
import IDroidOsuUserParam from './params/IDroidOsuUserParam';
import DroidUser from './objects/DroidUser';
import cheerio from 'cheerio';
import OsuUserRoute from '../../routes/OsuUserRoute';

export default class DroidUsersAPI extends OsuUserRoute<
  DroidUser,
  IBanchoAPIUserResponse,
  IDroidOsuUserParam
> {
  public async get(
    params?: IDroidOsuUserParam
  ): Promise<DroidUser | undefined> {
    const data = await this.getRawResponse(params, '');
    const $ = cheerio.load(data);

    const stringZero: string = (0).toString();
    const username = $('div.h3.m-t-xs.m-b-xs').text();

    if (!username) {
      return undefined;
    }

    const apiUser: IBanchoAPIUserResponse = {
      username,
      country: $('small.text-muted').first().text(),
      count300: stringZero,
      count100: stringZero,
      count50: stringZero,
      count_rank_ssh: stringZero,
      count_rank_ss: stringZero,
      count_rank_sh: stringZero,
      count_rank_s: stringZero,
      count_rank_a: stringZero,
      playcount: stringZero,
      level: stringZero,
      pp_rank: parseInt($('span.m-b-xs.h4.block').first().text()).toString(),
      pp_country_rank: stringZero,
      user_id: (params as IDroidOsuUserParam).uid.toString(),
      ranked_score: stringZero,
      join_date: stringZero,
      total_score: stringZero,
      pp_raw: stringZero,
      accuracy: stringZero,
      total_seconds_played: stringZero,
      events: [],
    };

    const pullRight = $('span.pull-right');

    for (let i = 3; i < pullRight.length; i++) {
      const item = pullRight[i];
      if (!item) continue;

      const el = $.load(item);
      const textSafe = el.text().replaceAll(',', '');
      const stringValue = parseFloat(textSafe).toString();

      switch (i) {
        case 3:
          apiUser.total_score = stringValue;
          break;
        case 4:
          apiUser.accuracy = stringValue;
          break;
        case 5:
          apiUser.playcount = stringValue;
          break;
      }
    }

    return new DroidUser([apiUser], {
      html: data,
    });
  }
}
