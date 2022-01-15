import type ICommandContext from '../contexts/ICommandContext';
import SubCommand from '../SubCommand';
import ClassResolver from '../../io/ClassResolver';
import type { TypedArgs } from '../contexts/types';

export default class SubCommandResolver<
  CTX extends ICommandContext<TypedArgs<A>>,
  A
> extends ClassResolver<SubCommand<CTX, A>> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof SubCommand;
  }
}
