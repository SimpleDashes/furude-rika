import { Mod } from './Mod';

/**
 * Represents the HardRock mod.
 */
export class ModHardRock extends Mod {
  public override readonly scoreMultiplier: number = 1.06;
  public override readonly acronym: string = 'HR';
  public override readonly name: string = 'HardRock';
  public override readonly bitwise: number = 1 << 4;
  public override readonly ranked: boolean = true;
}
