import type IOsuUser from '../api/users/IOsuUser';

export default interface IBeatmapMetadataInfo {
  title: string;
  titleUnicode: string;

  artist: string;
  artistUnicode: string;

  author: IOsuUser<unknown>;

  source: string;

  tags: string;

  previewTime: number;

  audioFile: string;

  backgroundFile: string;
}
