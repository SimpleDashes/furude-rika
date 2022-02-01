import Event from '../../events/Event';
import type Vector2 from '../math/Vector2';
import type PathType from './types/PathType';

export default class PathControlPoint {
  readonly #position!: Vector2;

  public get Position(): Vector2 {
    return this.#position;
  }

  public set Position(value: Vector2) {
    if (value.equals(this.#position)) {
      return;
    }

    this.#position.copyFrom(value);
    this.changed.invoke();
  }

  private type?: PathType;

  public get Type(): PathType | undefined {
    return this.type;
  }

  public set Type(type: PathType | undefined) {
    if (type === this.type) return;

    this.type = type;
    this.changed.invoke();
  }

  public changed = new Event<[]>();

  public constructor(position: Vector2, type?: PathType) {
    this.Position = position;
    this.Type = type;
  }
}
