import { Mod } from './Mod';

/**
 * Represents the HalfTime mod.
 */
export class ModHalfTime extends Mod {
  public override readonly scoreMultiplier: number = 0.3;
  public override readonly acronym: string = 'HT';
  public override readonly name: string = 'HalfTime';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 8;
}
