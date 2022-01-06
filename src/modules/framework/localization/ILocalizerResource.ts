import ILocalizerStructure from './ILocalizerStructure';

export default interface ILocalizerResource<S extends ILocalizerStructure> {
  readonly locale: string;
  readonly structure: S;
}
