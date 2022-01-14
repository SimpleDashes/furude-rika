import ClassResolver from '../modules/framework/io/ClassResolver';
import FurudeResource from './FurudeResource';

export default class ResourceResolver extends ClassResolver<FurudeResource> {
  protected isInstanceOfT(object: unknown): boolean {
    return object instanceof FurudeResource;
  }
}
