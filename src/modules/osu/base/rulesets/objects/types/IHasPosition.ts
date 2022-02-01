import type Vector2 from '../../math/Vector2';
import type IHasXPosition from './IHasXPosition';
import type IHasYPosition from './IHasYPosition';

export default interface IHasPosition extends IHasXPosition, IHasYPosition {
  position: Vector2;
}
