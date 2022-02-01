import PlayScreen from '../../api/screens/PlayScreen';

export default class BreakPeriod {
  public static MIN_BREAK_DURATION = 650;

  public startTime: number;

  public endTime: number;

  public get duration(): number {
    return this.endTime - this.startTime;
  }

  public hasEffect(): boolean {
    return this.duration >= BreakPeriod.MIN_BREAK_DURATION;
  }

  public constructor(startTime: number, endTime: number) {
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public contains(time: number): boolean {
    return (
      time >= this.startTime &&
      time <= this.endTime - PlayScreen.BREAK_FADE_DURATION
    );
  }
}
