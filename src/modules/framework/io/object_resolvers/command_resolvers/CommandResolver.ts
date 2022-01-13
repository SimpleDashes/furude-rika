import BaseCommand from '../../../commands/BaseCommand';
import type ICommandContext from '../../../commands/interfaces/ICommandContext';
import ClassResolver from '../ClassResolver';

export default class CommandResolver<
  CTX extends ICommandContext
> extends ClassResolver<BaseCommand<CTX>> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof BaseCommand;
  }
}
