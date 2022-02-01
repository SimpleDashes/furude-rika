import { Mod } from './Mod';

/**
 * Represents the ScoreV2 mod.
 */
export class ModScoreV2 extends Mod {
  public override readonly scoreMultiplier: number = 1;
  public override readonly acronym: string = 'V2';
  public override readonly name: string = 'ScoreV2';
  public override readonly ranked: boolean = false;
  public override readonly bitwise: number = 1 << 29;
}
