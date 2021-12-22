import IRunsCommand from '../../framework/commands/interfaces/IRunsCommand';
import FurudeRika from '../FurudeRika';

export default abstract class {
  public readonly runner;
  public constructor(runner: IRunsCommand<FurudeRika>) {
    this.runner = runner;
  }
  public async get(): Promise<this> {
    await this.build();
    return this;
  }
  protected abstract build(): Promise<void>;
}
