import IRunsCommand from '../../framework/commands/interfaces/IRunsCommand';
import FurudeRika from '../FurudeRika';

export default abstract class BaseContext {
  public readonly runner;
  public readonly db;
  public constructor(runner: IRunsCommand<FurudeRika>) {
    this.runner = runner;
    this.db = runner.client.db;
  }
  public async get(): Promise<this> {
    await this.build();
    return this;
  }
  protected abstract build(): Promise<void>;
}
