import BindableInteger from '../../bindables/BindableInteger';

export default class OsuUserEventsBindable extends BindableInteger {
  public constructor(value: number | undefined) {
    super(value, value, {
      minValue: 1,
      maxValue: 31,
    });
  }
}
