import { Mod } from './Mod';

/**
 * Represents the DoubleTime mod.
 */
export class ModDoubleTime extends Mod {
  public override readonly scoreMultiplier: number = 1.12;
  public override readonly acronym: string = 'DT';
  public override readonly name: string = 'DoubleTime';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 6;
}
