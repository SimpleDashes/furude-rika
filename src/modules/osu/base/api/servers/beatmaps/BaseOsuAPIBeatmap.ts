import OsuModes from '../../../enums/OsuModes';
import type IBanchoAPIBeatmapResponse from '../implementations/bancho/interfaces/beatmaps/IBanchoAPIBeatmapResponse';
import BeatmapApprovalState from './enums/BeatmapApprovalState';
import BeatmapGenres from './enums/BeatmapGenres';
import BeatmapLanguages from './enums/BeatmapLanguages';
import type IAPIOsuBeatmap from './IAPIOsuBeatmap';
import type IBeatmapDifficulty from './interfaces/IBeatmapDifficulty';
import type ICreatorInformation from './interfaces/ICreatorInformation';
import type IOsuPerformanceDifficulty from './interfaces/IOsuPerformanceDifficulty';

export default class BaseOsuAPIBeatmap implements IAPIOsuBeatmap {
  public readonly approved: BeatmapApprovalState;
  public readonly submitDate: Date;
  public readonly approvedDate: Date;
  public readonly lastUpdate: Date;
  public readonly artist: string;
  public readonly beatmapID: number;
  public readonly beatmapSetID: number;
  public readonly bpm: number;
  public readonly creator: ICreatorInformation;
  public readonly difficultyRating: number;
  public readonly difficultyInformation: IBeatmapDifficulty;
  public readonly difficultyPerformance: IOsuPerformanceDifficulty;
  public readonly hitLength: number;
  public readonly source: string;
  public readonly genre: BeatmapGenres;
  public readonly language: BeatmapLanguages;
  public readonly title: string;
  public readonly totalLength: number;
  public readonly version: string;
  public readonly md5: string;
  public readonly mode: OsuModes;
  public readonly tags: string[];
  public readonly favorites: number;
  public readonly rating: number;
  public readonly playedTimes: number;
  public readonly circles: number;
  public readonly sliders: number;
  public readonly spinners: number;
  public readonly maxCombo: number;
  public readonly storyboardAvailable: boolean;
  public readonly videoAvailable: boolean;
  public readonly downloadAvailable: boolean;
  public readonly audioAvailable: boolean;

  public constructor(apiResponse: IBanchoAPIBeatmapResponse) {
    this.approved = Object.values(BeatmapApprovalState).find(
      (v) => v === parseInt(apiResponse.approved)
    ) as BeatmapApprovalState;
    this.submitDate = new Date(apiResponse.submit_date);
    this.approvedDate = new Date(apiResponse.approved_date);
    this.lastUpdate = new Date(apiResponse.last_update);
    this.artist = apiResponse.artist;
    this.beatmapID = parseInt(apiResponse.beatmap_id);
    this.beatmapSetID = parseInt(apiResponse.beatmapset_id);
    this.bpm = parseInt(apiResponse.bpm);
    this.creator = {
      id: parseInt(apiResponse.creator_id),
      name: apiResponse.creator,
    };
    this.difficultyRating = parseInt(apiResponse.difficultyrating);
    this.difficultyInformation = {
      cs: parseInt(apiResponse.diff_size),
      hp: parseInt(apiResponse.diff_drain),
      ar: parseInt(apiResponse.diff_approach),
      od: parseInt(apiResponse.diff_overall),
    };
    this.difficultyPerformance = {
      speed: parseFloat(apiResponse.diff_speed),
      aim: parseFloat(apiResponse.diff_aim),
    };
    this.hitLength = parseInt(apiResponse.hit_length);
    this.source = apiResponse.source;
    this.genre = Object.values(BeatmapGenres).find(
      (v) => v === parseInt(apiResponse.genre_id)
    ) as BeatmapGenres;
    this.language = Object.values(BeatmapLanguages).find(
      (v) => v === parseInt(apiResponse.language_id)
    ) as BeatmapLanguages;
    this.title = apiResponse.title;
    this.totalLength = parseInt(apiResponse.total_length);
    this.version = apiResponse.version;
    this.md5 = apiResponse.file_md5;
    this.mode = Object.values(OsuModes).find(
      (v) => v === parseInt(apiResponse.mode)
    ) as OsuModes;
    this.tags = apiResponse.tags.split(' ');
    this.favorites = parseInt(apiResponse.favourite_count);
    this.rating = parseFloat(apiResponse.rating);
    this.playedTimes = parseInt(apiResponse.playcount);
    this.circles = parseInt(apiResponse.count_normal);
    this.sliders = parseInt(apiResponse.count_slider);
    this.spinners = parseInt(apiResponse.count_slider);
    this.maxCombo = parseInt(apiResponse.max_combo);
    this.storyboardAvailable = !!apiResponse.storyboard;
    this.videoAvailable = !!apiResponse.video;
    this.downloadAvailable = !apiResponse.download_unavailable;
    this.audioAvailable = !apiResponse.audio_unavailable;
  }

  public getPageUrl(): string {
    return `https://osu.ppy.sh/beatmapsets/${this.beatmapSetID}#osu/${this.beatmapID}`;
  }

  public getCoverImage(): string {
    return `https://assets.ppy.sh/beatmaps/${this.beatmapSetID}/covers/cover.jpg`;
  }

  public getCoverThumbnail(): string {
    return `https://b.ppy.sh/thumb/${this.beatmapSetID}l.jpg`;
  }
}
