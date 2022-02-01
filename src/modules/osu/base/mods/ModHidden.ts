import { Mod } from './Mod';

/**
 * Represents the Hidden mod.
 */
export class ModHidden extends Mod {
  public override readonly scoreMultiplier: number = 1.06;
  public override readonly acronym: string = 'HD';
  public override readonly name: string = 'Hidden';
  public override readonly bitwise: number = 1 << 3;
  public override readonly ranked: boolean = true;
}
