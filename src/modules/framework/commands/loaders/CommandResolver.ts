import BaseCommand from '../BaseCommand';
import type ICommandContext from '../contexts/ICommandContext';
import ClassResolver from '../../io/ClassResolver';
import type { TypedArgs } from '../decorators/ContextDecorators';

export default class CommandResolver<
  CTX extends ICommandContext<TypedArgs<A>>,
  A
> extends ClassResolver<BaseCommand<CTX, A>> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof BaseCommand;
  }
}
