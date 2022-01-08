import IOsuCount from '../../interfaces/IOsuCount';

export default interface IOsuScoreCounts extends IOsuCount {
  misses: number;
  combo: number;
  katu: number;
  geki: number;
}
