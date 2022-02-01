import { Mod } from './Mod';

/**
 * Represents the SuddenDeath mod.
 */
export class ModSuddenDeath extends Mod {
  public override readonly scoreMultiplier: number = 1;
  public override readonly acronym: string = 'SD';
  public override readonly name: string = 'Sudden Death';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 5;
}
