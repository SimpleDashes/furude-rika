import SubCommandGroup from '../../../commands/SubCommandGroup';
import ClassResolver from '../ClassResolver';

export default class SubCommandGroupResolver extends ClassResolver<
  SubCommandGroup<never>
> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof SubCommandGroup;
  }
}
