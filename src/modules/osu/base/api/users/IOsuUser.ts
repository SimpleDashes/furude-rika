import type IOsuScore from '../scores/IOsuScore';
import type { AnyServer } from '../servers/OsuServers';
import type IOsuUserCounts from './interfaces/IOsuUserCounts';
import type IOsuUserEvent from './interfaces/IOsuUserEvent';
import type IOsuUserPPS from './interfaces/IOsuUserPPS';
import type IOsuUserRanks from './interfaces/IOsuUserRanks';
import type IOsuUserScores from './interfaces/IOsuUserScores';

export default interface IOsuUser<P> {
  user_id: number;
  username: string;
  join_date: Date;
  counts: IOsuUserCounts;
  scores: IOsuUserScores;
  pps: IOsuUserPPS;
  level: number;
  accuracy: number;
  ranks: IOsuUserRanks;
  total_seconds_played: number;
  country: string;
  events: IOsuUserEvent[];
  server: AnyServer;

  fetchScores: (params: P, fetchBeatmaps?: boolean) => Promise<IOsuScore[]>;

  getAvatarUrl: () => string;

  getProfileUrl: () => string;
}
