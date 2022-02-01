import { Mod } from './Mod';

/**
 * Represents the Auto mod.
 */
export class ModAuto extends Mod {
  public override readonly scoreMultiplier: number = 0;
  public override readonly acronym: string = 'AT';
  public override readonly name: string = 'Autoplay';
  public override readonly ranked: boolean = false;
  public override readonly bitwise: number = 1 << 11;
}
