import type IBaseBanchoAPIScore from './IBaseBanchoAPIScore';

export default interface IBanchoAPIUserRecentScore extends IBaseBanchoAPIScore {
  fetchBeatmaps?: boolean;
}
