import SubCommand from '../../../commands/SubCommand';
import ClassResolver from '../ClassResolver';

export default class SubCommandResolver extends ClassResolver<
  SubCommand<never>
> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof SubCommand;
  }
}
