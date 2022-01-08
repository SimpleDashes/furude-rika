import OsuUserRecentRoute from '../../routes/OsuUserRecentRoute';
import DroidScore from './objects/DroidScore';
import IBanchoAPIUserRecentScore from '../bancho/interfaces/scores/IBanchoAPIUserRecentScore';
import IDroidOsuUserRecentsParam from './params/IDroidOsuUserRecentsParams';
import cheerio from 'cheerio';

export default class DroidUserRecentsAPI extends OsuUserRecentRoute<
  DroidScore,
  IBanchoAPIUserRecentScore,
  IDroidOsuUserRecentsParam
> {
  async get(
    params: IDroidOsuUserRecentsParam
  ): Promise<DroidScore[] | undefined> {
    if (!params.u.html) return undefined;

    const $ = cheerio.load(params.u.html!);

    const liListGroupItem = $('li.list-group-item');
    const limit = Math.min(
      liListGroupItem.length,
      params.limit?.Current ?? liListGroupItem.length
    );

    const scores: DroidScore[] = [];
    for (let i = 0; i < limit; i++) {
      if (i > liListGroupItem.length - 9) {
        break;
      }

      const stringEmpty = '';
      const stringZero = (0).toString();

      const html = liListGroupItem[i];

      const el = $.load(html!);
      const small = el('small').text().split('/');
      const hiddenStats = el('span.hidden')
        .text()
        .replaceAll('"', '')
        .replaceAll(':', '')
        .replaceAll('{', '')
        .replaceAll('}', '')
        .replaceAll('miss', '')
        .replaceAll('hash', '')
        .replaceAll(' ', '')
        .split(',');

      const apiScore: IBanchoAPIUserRecentScore = {
        beatmap_id: stringEmpty,
        score: small[1]!.replaceAll(',', '').replaceAll(' ', ''),
        maxcombo: small[3]!.replace('x', ''),
        count50: stringZero,
        count100: stringZero,
        count300: stringZero,
        countmiss: hiddenStats[0]!,
        countkatu: stringZero,
        countgeki: stringZero,
        perfect: stringZero,
        enabled_mods: stringZero, // TODO BITWISE MODS
        user_id: params.u.user_id.toString(),
        date: small[0]!.slice(0, -1),
        rank: $('span.m-b-xs.h4.block').first().text(),
      };

      const score = new DroidScore(apiScore);
      scores.push(score);
    }

    return scores;
  }
}
