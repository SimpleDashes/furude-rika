import type { ConstructorType } from 'discowork';
import { assertDefinedGet } from 'discowork';
import type IBeatmap from '../beatmaps/IBeatmap';
import type { Mod } from '../mods/Mod';
import { StandardMods } from '../mods/StandardMods';
import type ScoreInfo from '../scoring/ScoreInfo';
import type DifficultyAttributes from './difficulty/DifficultyAttributes';
import type DifficultyCalculator from './difficulty/DifficultyCalculator';
import type PerformanceCalculator from './difficulty/PerformanceCalculator';

import type RulesetInfo from './RuleSetInfo';

export default abstract class Ruleset {
  public readonly ruleSetInfo!: RulesetInfo;

  private allMods = this.createAllMods();

  public get AllMods(): Mod[] {
    return this.allMods;
  }

  /**
   * creates new fresh instances for all valid mods for the current ruleset.
   * @returns All fresh instances.
   */
  public createAllMods(): Mod[] {
    return StandardMods.ALL_MODS.map((m) => new m.constructor.prototype());
  }

  public getModsFromAcronym(acronym: string): Mod | undefined {
    return this.allMods.find((m) => m.acronym === acronym);
  }

  public getMod<T extends ConstructorType<[], M>, M extends Mod>(
    constructor: T
  ): M | undefined {
    return this.AllMods.find(
      (m) => constructor.prototype === m.constructor.prototype
    ) as M;
  }

  public abstract createDifficultyCalculator(
    beatmap: IBeatmap
  ): DifficultyCalculator;

  public createPerformanceCalculatorFromAttributes(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _attributes: DifficultyAttributes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _score: ScoreInfo
  ): PerformanceCalculator | undefined {
    return undefined;
  }

  public createPerformanceCalculator(
    beatmap: IBeatmap,
    score: ScoreInfo
  ): PerformanceCalculator {
    const difficultyCalculator = this.createDifficultyCalculator(beatmap);
    const difficultyAttributes = difficultyCalculator.calculate(score.mods);
    return assertDefinedGet(
      this.createPerformanceCalculatorFromAttributes(
        difficultyAttributes,
        score
      )
    );
  }
}
