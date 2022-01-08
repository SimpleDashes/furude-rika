import IOsuScoreCounts from './interfaces/IOsuScoreCounts';

export default interface IOsuScore {
  beatmapID: number;
  score: number;
  counts: IOsuScoreCounts;
  perfect: boolean;
  mods: string; // TODO: MODS ENUM OR CLASSES WHATEVER.
  userID: string;
  date: Date;
  rank: string; // TODO: RANK ENUM OR CLASSES WHATEVER.
}
