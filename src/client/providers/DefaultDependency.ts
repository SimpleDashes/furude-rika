import { FurudeUser } from '../../database/entity/FurudeUser';
import FurudeLocales from '../../localization/FurudeLocales';
import BaseDependency from './BaseDependency';

export default class extends BaseDependency {
  public furudeUser!: FurudeUser;
  public localizer!: FurudeLocales;

  protected async build(): Promise<void> {
    this.furudeUser = await this.runner.client.db.getFurudeUser(
      this.runner.interaction.user
    );
    this.localizer = new FurudeLocales({ runner: this.runner });
  }
}
