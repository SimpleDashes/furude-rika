import assert from 'assert';
import Constructor from '../interfaces/Constructor';

export function assertDefined<T>(object: T): asserts object is NonNullable<T> {
  assert(object, 'assertDefined assertion failed for object.');
}

export function assertInstanceOf<T>(
  object: unknown,
  type: Constructor<[...never], T>
): asserts object is T {
  assert(object instanceof type);
}
