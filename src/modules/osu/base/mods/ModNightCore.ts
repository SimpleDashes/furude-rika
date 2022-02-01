import { Mod } from './Mod';

/**
 * Represents the NightCore mod.
 */
export class ModNightCore extends Mod {
  public override readonly scoreMultiplier: number = 1.12;
  public override readonly acronym: string = 'NC';
  public override readonly name: string = 'NightCore';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 9;
}
