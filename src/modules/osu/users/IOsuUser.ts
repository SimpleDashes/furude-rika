import IOsuScore from '../scores/IOsuScore';
import { AnyServer } from '../servers/OsuServers';
import IOsuUserCounts from './interfaces/IOsuUserCounts';
import IOsuUserEvent from './interfaces/IOsuUserEvent';
import IOsuUserPPS from './interfaces/IOsuUserPPS';
import IOsuUserRanks from './interfaces/IOsuUserRanks';
import IOsuUserScores from './interfaces/IOsuUserScores';

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

  fetchScores(params: P, fetchBeatmaps?: boolean): Promise<IOsuScore[]>;
}
