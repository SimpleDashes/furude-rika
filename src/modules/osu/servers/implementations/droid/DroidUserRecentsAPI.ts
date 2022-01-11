import OsuUserRecentRoute from '../../routes/OsuUserRecentRoute';
import DroidScore from './objects/DroidScore';
import IBanchoAPIUserRecentScore from '../bancho/interfaces/scores/IBanchoAPIUserRecentScore';
import IDroidOsuUserRecentsParam from './params/IDroidOsuUserRecentsParams';
import cheerio from 'cheerio';
import IBanchoAPIBeatmapResponse from '../bancho/interfaces/beatmaps/IBanchoAPIBeatmapResponse';
import BaseOsuAPIBeatmap from '../../beatmaps/BaseOsuAPIBeatmap';

export default class DroidUserRecentsAPI extends OsuUserRecentRoute<
  DroidScore,
  IBanchoAPIUserRecentScore,
  IDroidOsuUserRecentsParam
> {
  async get(
    params: IDroidOsuUserRecentsParam,
    fetchBeatmaps?: boolean
  ): Promise<DroidScore[]> {
    if (!params.u.html) return [];

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

      const md5 = hiddenStats[1]!;

      const score = new DroidScore(apiScore, {
        beatmapHash: md5,
      });

      const apiBeatmap: IBanchoAPIBeatmapResponse = {
        approved: stringZero,
        submit_date: stringEmpty,
        approved_date: stringEmpty,
        last_update: stringEmpty,
        artist: stringEmpty,
        beatmap_id: stringZero,
        beatmapset_id: stringZero,
        bpm: stringEmpty,
        creator: stringEmpty,
        creator_id: stringZero,
        difficultyrating: stringZero,
        diff_aim: stringZero,
        diff_approach: stringZero,
        diff_drain: stringZero,
        diff_overall: stringZero,
        diff_size: stringZero,
        diff_speed: stringZero,
        hit_length: stringZero,
        source: stringEmpty,
        genre_id: stringZero,
        language_id: stringZero,
        title: stringEmpty,
        total_length: stringZero,
        version: stringEmpty,
        file_md5: md5,
        mode: stringZero,
        tags: stringZero,
        favourite_count: stringZero,
        rating: stringZero,
        playcount: stringZero,
        passcount: stringZero,
        count_normal: stringZero,
        count_slider: stringZero,
        count_spinner: stringZero,
        max_combo: stringZero,
        storyboard: stringZero,
        video: stringZero,
        audio_unavailable: (1).toString(),
        download_unavailable: (1).toString(),
      };

      const head = el('strong.block').text();

      let splitHead = head.split('-');
      apiBeatmap.creator = splitHead[0] ?? stringEmpty;
      splitHead.shift();
      splitHead = splitHead.join().split('[');
      apiBeatmap.title = (splitHead[0] ?? stringEmpty).replaceAll('  ', '');
      apiBeatmap.version = splitHead[1]
        ? splitHead[1].substring(0, splitHead[1].length - 1)
        : stringEmpty;

      score.apiBeatmap = new BaseOsuAPIBeatmap(apiBeatmap);

      scores.push(score);
    }

    if (fetchBeatmaps) {
      for (const score of scores) {
        await score.fetchBeatmap();
      }
    }

    return scores;
  }
}
