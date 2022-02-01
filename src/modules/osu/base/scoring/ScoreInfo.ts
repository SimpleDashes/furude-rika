import type IOsuUser from '../api/users/IOsuUser';
import BeatmapInfo from '../beatmaps/BeatmapInfo';
import type { Mod } from '../mods/Mod';
import RulesetInfo from '../rulesets/RuleSetInfo';
import type IScoreInfo from './IScoreInfo';
import type ScoreRank from './ScoreRank';

export default class ScoreInfo implements IScoreInfo {
  public user!: IOsuUser<unknown>;
  public totalScore = 0;
  public maxCombo = 0;
  public accuracy = 0;
  public hasReplay = false;
  public date!: Date;
  public beatmap: BeatmapInfo;
  public ruleset: RulesetInfo;

  public constructor(
    user?: IOsuUser<unknown>,
    beatmap = new BeatmapInfo(),
    ruleset = new RulesetInfo()
  ) {
    if (user) this.user = user;
    this.beatmap = beatmap;
    this.ruleset = ruleset;
  }

  public rank!: ScoreRank;

  public mods: Mod[] = [];

  public passed = true;
}
