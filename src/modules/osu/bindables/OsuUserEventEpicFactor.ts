import BindableInteger from '../../bindables/BindableInteger';

export default class OsuUserEventEpicFactor extends BindableInteger {
  public constructor(value: number | undefined) {
    super(value, value, {
      minValue: 1,
      maxValue: 32,
    });
  }
}
