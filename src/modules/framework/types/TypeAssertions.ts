import assert from 'assert';
import type Constructor from '../interfaces/Constructor';

export function assertDefined<T>(object: T): asserts object is NonNullable<T> {
  assert(
    object !== null && object !== undefined,
    'assertDefined assertion failed for object.'
  );
}

export function assertDefinedGet<T>(
  object: T | undefined | null
): NonNullable<T> {
  assertDefined(object);
  return object as NonNullable<T>;
}

export function assertInstanceOf<T>(
  object: unknown,
  type: Constructor<[...never], T>
): asserts object is T {
  assert(object instanceof type);
}
