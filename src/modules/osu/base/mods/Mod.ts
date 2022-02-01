/**
 * Represents a mod.
 */
export abstract class Mod {
  /**
   * The score multiplier of this mod.
   */
  public abstract readonly scoreMultiplier: number;

  /**
   * The acronym of the mod.
   */
  public abstract readonly acronym: string;

  /**
   * The name of the mod.
   */
  public abstract readonly name: string;

  /**
   * Whether the mod is ranked in osu!standard.
   */
  public abstract readonly ranked: boolean;

  /**
   * The bitwise enum of the mod.
   */
  public abstract readonly bitwise: number;
}
