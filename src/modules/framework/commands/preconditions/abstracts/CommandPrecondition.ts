import IRunsCommand from '../../interfaces/IRunsCommand';

export default abstract class CommandPrecondition {
  public async validate(runner: IRunsCommand<any>): Promise<boolean> {
    return this.validateInternally(runner);
  }

  protected abstract validateInternally(
    runner: IRunsCommand<any>
  ): Promise<boolean>;
}
