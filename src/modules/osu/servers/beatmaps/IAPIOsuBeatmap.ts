import OsuModes from '../../enums/OsuModes';
import BeatmapApprovalState from './enums/BeatmapApprovalState';
import BeatmapGenres from './enums/BeatmapGenres';
import BeatmapLanguages from './enums/BeatmapLanguages';
import IBeatmapDifficulty from './interfaces/IBeatmapDifficulty';
import ICreatorInformation from './interfaces/ICreatorInformation';
import IOsuPerformanceDifficulty from './interfaces/IOsuPerformanceDifficulty';

export default interface IAPIOsuBeatmap {
  approved: BeatmapApprovalState;
  submitDate: Date;
  approvedDate: Date;
  lastUpdate: Date;
  artist: string;
  beatmapID: number;
  beatmapSetID: number;
  bpm: number;
  creator: ICreatorInformation;
  difficultyRating: number;
  difficultyInformation: IBeatmapDifficulty;
  difficultyPerformance: IOsuPerformanceDifficulty;
  hitLength: number;
  source: string;
  genre: BeatmapGenres;
  language: BeatmapLanguages;
  title: string;
  totalLength: number;
  version: string;
  md5: string; // TODO MAYBE MD5 TYPE IDK HOW THIS WORKS LOl
  mode: OsuModes;
  tags: string[];
  favorites: number;
  rating: number;
  playedTimes: number;
  circles: number;
  sliders: number;
  spinners: number;
  maxCombo: number;
  storyboardAvailable: boolean;
  videoAvailable: boolean;
  downloadAvailable: boolean;
  audioAvailable: boolean;

  getPageUrl(): string;

  getCoverImage(): string;

  getCoverThumbnail(): string;
}
