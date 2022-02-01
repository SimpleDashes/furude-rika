import type IBanchoOsuWithModesParam from './IBanchoOsuWithModesParam';
import type IBanchoOsuWithUserParam from './IBanchoOsuWithUserParam';

export default interface IBanchoBeatmapParam
  extends IBanchoOsuWithUserParam,
    IBanchoOsuWithModesParam {
  since?: Date;
  s?: number; // specify a beatmapset_id to return metadata from.
  b?: number; // specify a beatmap_id to return metadata from.
  a?: boolean; //specify whether converted beatmaps are included. Only has an effect if m is chosen and not 0.
  h?: string; // specify a beatmap md5 hash.
  limit?: string; // the amount of results.
  mods?: number; // TODO: ACTUAL MODS SUPPORT BRUH
}
