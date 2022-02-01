import BindableNumber from '../../bindables/BindableNumber';
import type Vector2 from '../math/Vector2';
import type PathControlPoint from './PathControlPoint';

export default class SliderPath {
  public readonly expectedDistance = new BindableNumber();

  public hasValidDistance(): boolean {
    throw '';
  }

  public readonly controlPoints: PathControlPoint[] = [];

  private readonly calculatedPath: Vector2[] = [];
  private readonly culmulativeLength: number[] = [];

  private calculatedLength = 0;

  public constructor() {
    this.expectedDistance.addValueChangeListener(this.invalidate);
  }

  private invalidate(): void {
    /**
     *
     */
  }
}
