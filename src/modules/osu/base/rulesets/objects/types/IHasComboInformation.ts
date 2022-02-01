import type BindableBoolean from '../../../bindables/BindableBoolean';
import type BindableInteger from '../../../bindables/BindableInteger';

export default interface IHasComboInformation {
  indexInCurrentComboBindable: BindableInteger;

  indexInCurrentCombo: number;

  comboIndexBindable: BindableInteger;

  comboIndex: number;

  comboIndexWithOffsetsBindable: BindableInteger;

  comboIndexWithOffsets: number;

  newCombo: boolean;

  lastInComboBindable: BindableBoolean;

  lastInCombo: boolean;
}
