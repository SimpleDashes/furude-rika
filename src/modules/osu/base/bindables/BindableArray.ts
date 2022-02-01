import BindableValue from './BindableValue';

export default class BindableArray<T>
  extends BindableValue<T[]>
  implements Array<T>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public flat<A, D extends number = 1>(this: A, _depth?: D): FlatArray<A, D>[] {
    throw new Error('Method not implemented.');
  }

  [n: number]: T;

  public get length(): number {
    return this.Value.length;
  }

  public pop(): T | undefined {
    return this.Value.pop();
  }

  public push(...items: T[]): number {
    return this.Value.push(...items);
  }

  public concat(...items: (T | ConcatArray<T>)[]): T[] {
    return this.Value.concat(...items);
  }

  public join(separator?: string): string {
    return this.Value.join(separator);
  }

  public reverse(): T[] {
    return this.Value.reverse();
  }

  public shift(): T | undefined {
    return this.Value.shift();
  }

  public slice(start?: number, end?: number): T[] {
    return this.Value.slice(start, end);
  }

  public sort(compareFn?: (a: T, b: T) => number): this {
    return this.Value.sort(compareFn) as this;
  }

  public splice(start: number, deleteCount?: number): T[] {
    return this.Value.splice(start, deleteCount);
  }

  public unshift(...items: T[]): number {
    return this.Value.unshift(...items);
  }

  public indexOf(searchElement: T, fromIndex?: number): number {
    return this.Value.indexOf(searchElement, fromIndex);
  }

  public lastIndexOf(searchElement: T, fromIndex?: number): number {
    return this.Value.lastIndexOf(searchElement, fromIndex);
  }

  public every<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: BindableArray<T>
  ): boolean {
    return this.Value.every(predicate, thisArg);
  }

  public some(
    predicate: (value: T, index: number, array: T[]) => unknown,
    thisArg?: BindableValue<T>
  ): boolean {
    return this.Value.some(predicate, thisArg);
  }

  public forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: BindableValue<T>
  ): void {
    return this.Value.forEach(callbackfn, thisArg);
  }

  public map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: BindableValue<T>
  ): U[] {
    return this.Value.map(callbackfn, thisArg);
  }

  public filter<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: BindableValue<T>
  ): T[] | S[] {
    return this.Value.filter(predicate, thisArg);
  }

  public reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ): T;

  public reduce(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T,
    initialValue: T
  ): T;

  public reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ): U;

  public reduce(callbackfn: never): T {
    return this.Value.reduce(callbackfn);
  }

  public reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ): T;

  public reduceRight(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T,
    initialValue: T
  ): T;

  public reduceRight<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ): U;

  public reduceRight(callbackfn: never): T {
    return this.Value.reduceRight(callbackfn);
  }

  public find<S extends T>(
    predicate: (this: void, value: T, index: number, obj: T[]) => value is S,
    thisArg?: BindableArray<T>
  ): S | undefined {
    return this.Value.find(predicate, thisArg);
  }

  public findIndex(
    predicate: (value: T, index: number, obj: T[]) => unknown,
    thisArg?: BindableArray<T>
  ): number {
    return this.Value.findIndex(predicate, thisArg);
  }

  public fill(value: T, start?: number, end?: number): this {
    this.Value.fill(value, start, end);
    return this;
  }

  public copyWithin(target: number, start: number, end?: number): this {
    this.Value.copyWithin(target, start, end);
    return this;
  }

  public entries(): IterableIterator<[number, T]> {
    return this.Value.entries();
  }

  public keys(): IterableIterator<number> {
    return this.Value.keys();
  }

  public values(): IterableIterator<T> {
    return this.Value.values();
  }

  public includes(searchElement: T, fromIndex?: number): boolean {
    return this.Value.includes(searchElement, fromIndex);
  }

  public flatMap<U, This = undefined>(
    callback: (
      this: This,
      value: T,
      index: number,
      array: T[]
    ) => U | readonly U[],
    thisArg?: This
  ): U[] {
    return this.Value.flatMap(callback, thisArg);
  }

  public at(index: number): T | undefined {
    return this.Value.at(index);
  }

  public [Symbol.iterator](): IterableIterator<T> {
    return this.Value[Symbol.iterator]();
  }

  public [Symbol.unscopables](): {
    copyWithin: boolean;
    entries: boolean;
    fill: boolean;
    find: boolean;
    findIndex: boolean;
    keys: boolean;
    values: boolean;
  } {
    return this.Value[Symbol.unscopables]();
  }
}
