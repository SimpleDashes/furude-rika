import BindableInteger from '../../bindables/BindableInteger';

export default class OsuBeatmapGetterBindable extends BindableInteger {
  public constructor(value: number | undefined) {
    super(value, {
      minValue: 1,
      maxValue: 500,
    });
  }
}
