import BaseCommand from '../../../commands/BaseCommand';
import ClassResolver from '../ClassResolver';

export default class CommandResolver extends ClassResolver<BaseCommand<never>> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof BaseCommand;
  }
}
