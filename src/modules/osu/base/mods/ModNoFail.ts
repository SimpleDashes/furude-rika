import { Mod } from './Mod';

/**
 * Represents the NoFail mod.
 */
export class ModNoFail extends Mod {
  public override readonly scoreMultiplier: number = 0.5;
  public override readonly acronym: string = 'NF';
  public override readonly name: string = 'NoFail';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 0;
}
