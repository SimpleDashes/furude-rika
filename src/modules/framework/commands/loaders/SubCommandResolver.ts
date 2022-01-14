import type ICommandContext from '../interfaces/ICommandContext';
import SubCommand from '../SubCommand';
import ClassResolver from '../../io/ClassResolver';

export default class SubCommandResolver<
  CTX extends ICommandContext
> extends ClassResolver<SubCommand<CTX>> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof SubCommand;
  }
}
