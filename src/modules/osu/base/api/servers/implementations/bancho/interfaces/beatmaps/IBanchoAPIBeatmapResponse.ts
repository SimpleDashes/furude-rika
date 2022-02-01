export default interface IBanchoAPIBeatmapResponse {
  approved: string; // 4 = loved, 3 = qualified, 2 = approved, 1 = ranked, 0 = pending, -1 = WIP, -2 = graveyard
  submit_date: string; // date submitted, in UTC
  approved_date: string; // date ranked, in UTC
  last_update: string; // last update date, in UTC. May be after approved_date if map was unranked and reranked.
  artist: string;
  beatmap_id: string; // beatmap_id is per difficulty
  beatmapset_id: string; // beatmapset_id groups difficulties into a set
  bpm: string;
  creator: string;
  creator_id: string;
  difficultyrating: string; // The number of stars the map would have in-game and on the website
  diff_aim: string;
  diff_speed: string;
  diff_size: string; // Circle size value (CS)
  diff_overall: string; // Overall difficulty (OD)
  diff_approach: string; // Approach Rate (AR)
  diff_drain: string; // Health drain (HP)
  hit_length: string; // seconds from first note to last note not including breaks
  source: string;
  genre_id: string; // 0 = any, 1 = unspecified, 2 = video game, 3 = anime, 4 = rock, 5 = pop, 6 = other, 7 = novelty, 9 = hip hop, 10 = electronic, 11 = metal, 12 = classical, 13 = folk, 14 = jazz (note that there's no 8)
  language_id: string; // 0 = any, 1 = unspecified, 2 = english, 3 = japanese, 4 = chinese, 5 = instrumental, 6 = korean, 7 = french, 8 = german, 9 = swedish, 10 = spanish, 11 = italian, 12 = russian, 13 = polish, 14 = other
  title: string; // song name
  total_length: string; // seconds from first note to last note including breaks
  version: string; // difficulty name
  file_md5: string;
  // md5 hash of the beatmap
  mode: string; // game mode,
  tags: string; // Beatmap tags separated by spaces.
  favourite_count: string; // Number of times the beatmap was favourited. (Americans: notice the ou!)
  rating: string;
  playcount: string; // Number of times the beatmap was played
  passcount: string; // Number of times the beatmap was passed, completed (the user didn't fail or retry)
  count_normal: string;
  count_slider: string;
  count_spinner: string;
  max_combo: string; // The maximum combo a user can reach playing this beatmap.
  storyboard: string; // If this beatmap has a storyboard
  video: string; // If this beatmap has a video
  download_unavailable: string; // If the download for this beatmap is unavailable (old map, etc.)
  audio_unavailable: string;
}
