import LocaleResource from '../modules/framework/localization/resources/LocaleResource';
import type { FurudeLanguages } from './FurudeLocalizer';
import type FurudeResourceStructure from './FurudeResourceStructure';

export default class FurudeResource extends LocaleResource<
  FurudeLanguages,
  FurudeResourceStructure
> {}
