import { Mod } from './Mod';

/**
 * Represents the SpunOut mod.
 */
export class ModSpunOut extends Mod {
  public override readonly scoreMultiplier: number = 0.9;
  public override readonly acronym: string = 'SO';
  public override readonly name: string = 'SpunOut';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 12;
}
