import BaseCommand from '../BaseCommand';
import type ICommandContext from '../interfaces/ICommandContext';
import ClassResolver from '../../io/ClassResolver';

export default class CommandResolver<
  CTX extends ICommandContext
> extends ClassResolver<BaseCommand<CTX>> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof BaseCommand;
  }
}
