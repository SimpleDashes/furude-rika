import { Mod } from './Mod';

/**
 * Represents the TouchDevice mod.
 */
export class ModTouchDevice extends Mod {
  public override readonly scoreMultiplier: number = 1;
  public override readonly acronym: string = 'TD';
  public override readonly name: string = 'TouchDevice';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 2;
}
