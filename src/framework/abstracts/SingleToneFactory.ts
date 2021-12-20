import Constructor from '../interfaces/Constructor';

export default abstract class SingleToneFactory<T> {
  public instantiated: boolean = false;

  public createSingleTone(constructor: Constructor<T>, ...args: any[]): T {
    this.throwAlreadyInstantiated();
    this.instantiated = true;
    return this.createSingleToneInternally(constructor, args);
  }

  protected abstract createSingleToneInternally(
    constructor: Constructor<T>,
    ...args: any[]
  ): T;

  protected throwAlreadyInstantiated() {
    if (!this.instantiated) return;
    throw `This class is a singletone which is already instantiated`;
  }
}
