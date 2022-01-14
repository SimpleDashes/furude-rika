import SubCommandGroup from '../SubCommandGroup';
import ClassResolver from '../../io/ClassResolver';

export default class SubCommandGroupResolver extends ClassResolver<SubCommandGroup> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof SubCommandGroup;
  }
}
