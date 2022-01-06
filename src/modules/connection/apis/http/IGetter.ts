export default interface IGetter<T, P> {
  get(params?: P): Promise<T>;
}
