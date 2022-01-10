import BaseFurudeManager from './BaseFurudeManager';
import consola from 'consola';
import { hoursToMilliseconds } from 'date-fns';

export default abstract class BaseFurudeScanner extends BaseFurudeManager {
  public startScan(): void {
    setInterval(async () => {
      consola.success(`Started scanning ${this.scanningWhat}s`);
      await this.runScan();
      consola.success(`Finished scanning ${this.scanningWhat}s`);
    }, hoursToMilliseconds(this.executeEveryHours));
  }

  protected abstract scanningWhat: string;

  protected abstract runScan(): Promise<void>;

  protected executeEveryHours: number = 1;
}
