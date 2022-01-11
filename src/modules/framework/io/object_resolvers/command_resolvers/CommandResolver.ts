import BaseCommand from '../../../commands/BaseCommand';
import ClassResolver from '../ClassResolver';

export default class CommandResolver extends ClassResolver<
  BaseCommand<any, any>
> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof BaseCommand;
  }
}
