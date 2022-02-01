import BindableInteger from '../../bindables/BindableInteger';

export default class OsuUserRecentsLimitBindable extends BindableInteger {
  public constructor(value: number | undefined) {
    super(value, {
      minValue: 1,
      maxValue: 50,
    });
  }
}
