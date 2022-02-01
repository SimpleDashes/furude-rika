import type IHasXPosition from '../objects/types/IHasXPosition';
import type IHasYPosition from '../objects/types/IHasYPosition';

/**
 * Based on `Vector2` class in C#.
 */
export default class Vector2 implements IHasXPosition, IHasYPosition {
  /**
   * The x position of the vector.
   */
  public x: number;

  /**
   * The y position of the vector.
   */
  public y: number;

  public constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Multiplies the vector with another vector.
   */
  public multiply(vec: Vector2): Vector2 {
    return new Vector2(this.x * vec.x, this.y * vec.y);
  }

  public divide(divideFactor: number): Vector2 {
    if (divideFactor === 0) {
      throw new Error('Division by 0');
    }
    return new Vector2(this.x / divideFactor, this.y / divideFactor);
  }

  /**
   * Adds the vector with another vector.
   */
  public add(vec: Vector2): Vector2 {
    return new Vector2(this.x + vec.x, this.y + vec.y);
  }

  /**
   * Subtracts the vector with another vector.
   */
  public subtract(vec: Vector2): Vector2 {
    return new Vector2(this.x - vec.x, this.y - vec.y);
  }

  /**
   * The length of the vector.
   */
  public get length(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Performs a dot multiplication with another vector.
   */
  public dot(vec: Vector2): number {
    return this.x * vec.x + this.y * vec.y;
  }

  /**
   * Scales the vector.
   */
  public scale(scaleFactor: number): Vector2 {
    return new Vector2(this.x * scaleFactor, this.y * scaleFactor);
  }

  /**
   * Gets the distance between this vector and another vector.
   */
  public getDistance(vec: Vector2): number {
    const x: number = this.x - vec.x;
    const y: number = this.y - vec.y;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }

  /**
   * Normalizes the vector.
   */
  public normalize(): void {
    const length: number = this.length;
    this.x /= length;
    this.y /= length;
  }

  /**
   * Copies the position of the other vector to this vector.
   * @param other The other vector.
   */
  public copyFrom(other: Vector2): void {
    this.x = other.x;
    this.y = other.y;
  }

  /**
   * Copies the position of this vector to another vector.
   * @param other The other vector.
   */
  public copyTo(other: Vector2): void {
    other.x = this.x;
    other.y = this.y;
  }

  /**
   * Checks whether this vector is equal to another vector.
   *
   * @param other The other vector.
   */
  public equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
