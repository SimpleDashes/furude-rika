import assert from 'assert';

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
