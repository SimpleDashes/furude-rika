export const DEFAULT_DIFFICULTY = 5;

export const difficultyRangeRaw = (
  difficulty: number,
  min: number,
  mid: number,
  max: number
): number => {
  if (difficulty > 5) return mid + ((max - mid) * (difficulty - 5)) / 5;
  if (difficulty < 5) return mid - ((mid - min) * (5 - difficulty)) / 5;
  return mid;
};

type OverallDifficultyBasedDifficultyRange = {
  /**
   * Minimum of the resulting range which will be achieved by a difficulty value of 0.
   */
  0: number;

  /**
   * Midpoint of the resulting range which will be achieved by a difficulty value of 5
   */
  5: number;

  /**
   * Maximum of the resulting range which will be achieved by a difficulty value of 10.
   */
  10: number;
};

/**
 * Maps a difficulty value [0, 10] to a two-piece linear range of values.
 * @param difficulty The difficulty value to be mapped.
 * @param od The values that define the two linear ranges.
 * @returns The values that define the two linear ranges.
 */
export const difficultyRangeByOD = (
  difficulty: number,
  od: OverallDifficultyBasedDifficultyRange
): number => {
  return difficultyRangeRaw(difficulty, od[0], od[5], od[10]);
};

export default interface IBeatmapDifficultyInfo {
  /**
   * The drain rate of the associated beatmap.
   */
  drainRate: number;

  /**
   * The circle size of the associated beatmap.
   */
  circleSize: number;

  /**
   * The overall difficulty of the associated beatmap.
   */
  overallDifficulty: number;

  /**
   * The approach rate of the associated beatmap.
   */
  approachRate: number;

  /**
   * The slider multiplier of the associated beatmap.
   */
  sliderMultiplier: number;

  /**
   * The slider tick rate of the associated beatmap.
   */
  sliderTickRate: number;
}
