import { GuildChannel } from 'discord.js';
import DBChannel from '../../database/entity/DBChannel';
import DBGuild from '../../database/entity/DBGuild';
import DBUser from '../../database/entity/DBUser';
import FurudeLocales from '../../localization/FurudeLocales';
import BaseContext from './BaseContext';

export default class DefaultContext extends BaseContext {
  public dbUser!: DBUser;
  public dbGuild?: DBGuild;
  public dbChannel?: DBChannel;
  public localizer!: FurudeLocales;

  protected async build(): Promise<void> {
    this.dbUser = await this.runner.client.db.getUser(
      this.runner.interaction.user
    );
    if (this.runner.interaction.guild) {
      this.dbGuild = await this.runner.client.db.getGuild(
        this.runner.interaction.guild
      );
      if (this.runner.interaction.channel) {
        this.dbChannel = await this.runner.client.db.getChannel(
          this.runner.interaction.channel as GuildChannel
        );
      }
    }
    this.localizer = new FurudeLocales({ runner: this.runner });
  }
}
