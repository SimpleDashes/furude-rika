import FurudeRika from '../../FurudeRika';

export default abstract class BaseFurudeManager {
  protected readonly rika: FurudeRika;

  public constructor(rika: FurudeRika) {
    this.rika = rika;
  }
}
