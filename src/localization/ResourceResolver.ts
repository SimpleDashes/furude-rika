import ClassResolver from '../framework/io/object_resolvers/ClassResolver';
import FurudeResource from './FurudeResource';

export default class ResourceResolver extends ClassResolver<FurudeResource> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof FurudeResource;
  }
}
