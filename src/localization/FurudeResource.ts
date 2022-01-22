import { LocaleResource } from 'discowork';
import type { FurudeLanguages } from './FurudeLocalizer';
import type FurudeResourceStructure from './FurudeResourceStructure';

export default class FurudeResource extends LocaleResource<
  FurudeLanguages,
  FurudeResourceStructure
> {}
