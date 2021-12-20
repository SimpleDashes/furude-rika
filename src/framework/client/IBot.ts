import DirectoryMapper from '../io/DirectoryMapper';

export default interface IBot {
  readonly commandMappers: DirectoryMapper[];
  start(): Promise<void>;
}
