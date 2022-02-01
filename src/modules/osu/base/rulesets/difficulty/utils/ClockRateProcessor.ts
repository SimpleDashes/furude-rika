import type { Mod } from '../../../mods/Mod';
import { ModDoubleTime } from '../../../mods/ModDoubleTime';
import { ModHalfTime } from '../../../mods/ModHalfTime';

export default class ClockRateProcessor {
  public static processClockRate(mods: Mod[]): number {
    let clockRate = 1;
    mods.forEach((m) => {
      switch (m.constructor) {
        case ModDoubleTime:
          clockRate *= 1.5;
          break;
        case ModHalfTime:
          clockRate *= 0.75;
          break;
      }
    });
    return clockRate;
  }
}
