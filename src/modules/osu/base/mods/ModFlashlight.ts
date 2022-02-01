import { Mod } from './Mod';

/**
 * Represents the Flashlight mod.
 */
export class ModFlashlight extends Mod {
  public override readonly scoreMultiplier: number = 1.12;
  public override readonly acronym: string = 'FL';
  public override readonly name: string = 'Flashlight';
  public override readonly ranked: boolean = true;
  public override readonly bitwise: number = 1 << 10;
}
