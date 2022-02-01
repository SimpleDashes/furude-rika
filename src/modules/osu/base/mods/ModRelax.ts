import { Mod } from './Mod';

/**
 * Represents the Relax mod.
 */
export class ModRelax extends Mod {
  public override readonly scoreMultiplier: number = 0;
  public override readonly acronym: string = 'RX';
  public override readonly name: string = 'Relax';
  public override readonly ranked: boolean = false;
  public override readonly bitwise: number = 1 << 7;
}
