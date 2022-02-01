import type IOsuUser from '../api/users/IOsuUser';
import type IBeatmapMetadataInfo from './IBeatmapMetadataInfo';

export default class BeatmapMetadata implements IBeatmapMetadataInfo {
  public title = '';
  public titleUnicode = '';

  public artist = '';
  public artistUnicode = '';

  public author!: IOsuUser<unknown>;

  public source = '';

  public tags = '';

  /**
   * The time in milliseconds to begin playing the track for preview purposes.
   * If -1, the track should begin playing at 40% of its length.
   */
  public previewTime = -1;

  public audioFile = '';

  public backgroundFile = '';

  public constructor(author?: IOsuUser<unknown>) {
    if (author) {
      this.author = author;
    }
  }
}
