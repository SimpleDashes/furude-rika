import { Mod } from './Mod';

/**
 * Represents the Perfect mod.
 */
export class ModPerfect extends Mod {
  public override readonly scoreMultiplier: number = 1;
  public override readonly acronym: string = 'PF';
  public override readonly name: string = 'Perfect';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 14;
}
