export default interface Constructor<P extends any[], T> {
  new (...args: P): T;
}
