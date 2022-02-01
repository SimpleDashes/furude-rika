import { Mod } from './Mod';

/**
 * Represents the Easy mod.
 */
export class ModEasy extends Mod {
  public override readonly scoreMultiplier: number = 0.5;
  public override readonly acronym: string = 'EZ';
  public override readonly name: string = 'Easy';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 1;
}
