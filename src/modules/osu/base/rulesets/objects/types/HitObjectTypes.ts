import type HitObject from '../HitObject';
import type IHasComboInformation from './IHasComboInformation';
import type IHasDuration from './IHasDuration';

export default class HitObjectTypes {
  public static HasDuration(
    object: HitObject
  ): object is IHasDuration & HitObject {
    const tObject = object as unknown as IHasDuration;
    return (
      typeof tObject.endTime === 'number' &&
      typeof tObject.duration === 'number'
    );
  }

  public static HasComboInformation(
    object: HitObject
  ): object is IHasComboInformation & HitObject {
    const tObject = object as unknown as IHasComboInformation;
    return (
      typeof tObject.comboIndex === 'number' &&
      typeof tObject.comboIndexWithOffsets === 'number' &&
      typeof tObject.indexInCurrentCombo === 'number' &&
      typeof tObject.lastInCombo === 'boolean' &&
      typeof tObject.newCombo === 'boolean'
    );
  }
}
