import BaseFurudeManager from './BaseFurudeManager';
import consola from 'consola';
import schedule from 'node-schedule';

export default abstract class BaseFurudeScanner extends BaseFurudeManager {
  public startScan(): void {
    schedule.scheduleJob({ hour: this.executeEveryHours }, async () => {
      consola.success(`Started scanning ${this.scanningWhat}s`);
      await this.runScan();
      consola.success(`Finished scanning ${this.scanningWhat}s`);
    });
  }

  protected abstract scanningWhat: string;

  protected abstract runScan(): Promise<void>;

  protected executeEveryHours: number = 1;
}
