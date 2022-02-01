import { Mod } from './Mod';

/**
 * Represents the Autopilot mod.
 */
export class ModAutopilot extends Mod {
  public override readonly scoreMultiplier: number = 0;
  public override readonly acronym: string = 'AP';
  public override readonly name: string = 'Autopilot';
  public override readonly ranked: boolean = false;
  public override readonly bitwise: number = 1 << 13;
}
