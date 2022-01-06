import SubCommand from '../../../commands/SubCommand';
import ClassResolver from '../ClassResolver';

export default class SubCommandResolver extends ClassResolver<SubCommand<any>> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof SubCommand;
  }
}
