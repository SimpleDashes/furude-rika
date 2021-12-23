import CommandGroup from '../../../commands/CommandGroup';
import ClassResolver from '../ClassResolver';

export default class SubCommandGroupResolver extends ClassResolver<
  CommandGroup<any>
> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof CommandGroup;
  }
}
