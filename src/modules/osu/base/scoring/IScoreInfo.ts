import type IOsuUser from '../api/users/IOsuUser';
import type IBeatmapInfo from '../beatmaps/IBeatmapInfo';
import type IRulesetInfo from '../rulesets/IRulesetInfo';

export default interface IScoreInfo {
  user: IOsuUser<unknown>;
  totalScore: number;
  maxCombo: number;
  accuracy: number;
  hasReplay: boolean;
  date: Date;
  beatmap: IBeatmapInfo;
  ruleset: IRulesetInfo;
}
