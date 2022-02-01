import type IAPIOsuBeatmap from '../api/servers/beatmaps/IAPIOsuBeatmap';
import BeatmapDifficulty from './BeatmapDifficulty';
import BeatmapMetadata from './BeatmapMetadata';
import type IBeatmapInfo from './IBeatmapInfo';
import type IBeatmapSetInfo from './IBeatmapSetInfo';

export default class BeatmapInfo implements IBeatmapInfo {
  public difficultyName = '';

  public difficulty!: BeatmapDifficulty;

  public metadata!: BeatmapMetadata;

  public constructor(
    difficulty = new BeatmapDifficulty(),
    metadata = new BeatmapMetadata()
  ) {
    this.difficulty = difficulty;
    this.metadata = metadata;
  }

  public beatmapSet?: IBeatmapSetInfo;

  public starRating = 0;

  public length = 0;
  public bpm = 0;

  public hash = '';

  public md5 = '';

  public audioLeadIn = 0;

  public stackLeniency = 0.7;

  public specialStyle = false;

  public LetterboxInBreaks = false;

  public WidescreenStoryboard = true;

  public EpilepsyWarning = false;

  public SamplesMatchPlaybackRate = true;

  public DistanceSpacing = 0;

  public BeatDivisor = 0;

  public GridSize = 0;

  public timelineZoom = 1;

  public onlineInfo?: IAPIOsuBeatmap;

  public maxCombo = 0;

  public bookmarks: number[] = [];

  public beatmapVersion = 0;
}
