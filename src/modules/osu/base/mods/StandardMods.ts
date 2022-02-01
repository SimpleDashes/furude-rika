import type { Mod } from './Mod';
import { ModAuto } from './ModAuto';
import { ModAutopilot } from './ModAutopilot';
import { ModDoubleTime } from './ModDoubleTime';
import { ModEasy } from './ModEasy';
import { ModFlashlight } from './ModFlashlight';
import { ModHalfTime } from './ModHalfTime';
import { ModHardRock } from './ModHardRock';
import { ModHidden } from './ModHidden';
import { ModNightCore } from './ModNightCore';
import { ModNoFail } from './ModNoFail';
import { ModPerfect } from './ModPerfect';
import { ModRelax } from './ModRelax';
import { ModScoreV2 } from './ModScoreV2';
import { ModSpunOut } from './ModSpunOut';
import { ModSuddenDeath } from './ModSuddenDeath';
import { ModTouchDevice } from './ModTouchDevice';

export class StandardMods {
  public static ALL_MODS: Mod[] = [];

  public static AUTO = this.add(new ModAuto());
  public static AUTO_PILOT = this.add(new ModAutopilot());
  public static DOUBLE_TIME = this.add(new ModDoubleTime());
  public static EASY = this.add(new ModEasy());
  public static FLASHLIGHT = this.add(new ModFlashlight());
  public static HALF_TIME = this.add(new ModHalfTime());
  public static HARD_ROCK = this.add(new ModHardRock());
  public static HIDDEN = this.add(new ModHidden());
  public static NIGHTCORE = this.add(new ModNightCore());
  public static NO_FAIL = this.add(new ModNoFail());
  public static PERFECT = this.add(new ModPerfect());
  public static RELAX = this.add(new ModRelax());
  public static SCORE_V2 = this.add(new ModScoreV2());
  public static SPUN_OUT = this.add(new ModSpunOut());
  public static SUDDEN_DEATH = this.add(new ModSuddenDeath());
  public static TOUCH_DEVICE = this.add(new ModTouchDevice());

  private static add<T extends Mod>(mod: T): T {
    this.ALL_MODS.push(mod);
    return mod;
  }
}
