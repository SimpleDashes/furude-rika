import type ICommandContext from '../../../commands/interfaces/ICommandContext';
import SubCommand from '../../../commands/SubCommand';
import ClassResolver from '../ClassResolver';

export default class SubCommandResolver<
  CTX extends ICommandContext
> extends ClassResolver<SubCommand<CTX>> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof SubCommand;
  }
}
