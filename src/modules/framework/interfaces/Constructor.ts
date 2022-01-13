export default interface Constructor<P extends unknown[], T> {
  new (...args: P): T;
}
