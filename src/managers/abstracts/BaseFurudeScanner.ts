import BaseFurudeManager from './BaseFurudeManager';
import { hoursToMilliseconds } from 'date-fns';
import { Logger } from 'discowork';

export default abstract class BaseFurudeScanner extends BaseFurudeManager {
  public startScan(): void {
    setInterval(async () => {
      Logger.success(`Started scanning ${this.scanningWhat}s`);
      await this.runScan();
      Logger.success(`Finished scanning ${this.scanningWhat}s`);
    }, hoursToMilliseconds(this.executeEveryHours));
  }

  protected abstract scanningWhat: string;

  protected abstract runScan(): Promise<void>;

  protected executeEveryHours = 1;
}
