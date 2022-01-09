import { secondsToHours } from 'date-fns';
import { CommandInteraction, CacheType } from 'discord.js';
import OsuContext from '../../../client/contexts/osu/OsuContext';
import FurudeRika from '../../../client/FurudeRika';
import ExpandableEmbedHelper from '../../../discord/commands/helpers/ExpandableEmbedHelper';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import IHasExpandableEmbed from '../../../discord/commands/interfaces/IHasExpandableEmbed';
import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import IOsuUser from '../../../modules/osu/users/IOsuUser';
import OsuSubCommand from '../wrapper/OsuSubCommand';

export default class OsuProfile
  extends OsuSubCommand
  implements IHasExpandableEmbed
{
  private serverUserOptions = this.registerServerUserOptions(this, (o) => {
    o.server.setDescription('The server of the account you want to view.');
    o.user.setDescription('The username of the account you want to view.');
  });

  private discordUserOption = this.registerDiscordUserOption(
    this
  ).setDescription('The user who owns the account you want to view.');

  public constructor() {
    super({
      name: 'profile',
      description: 'Views a user osu! profile.',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<OsuContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const osuUser = await this.getUserFromServerUserOptions(
        this.serverUserOptions,
        runner,
        this.discordUserOption.apply(interaction)
      );

      if (!osuUser) {
        await this.sendOsuUserNotFound(runner);
        return;
      }

      const expandedEmbed = this.createExpandedEmbed(osuUser, runner);
      const minimizedEmbed = this.createMinimizedEmbed(osuUser, runner);

      await ExpandableEmbedHelper.createInteractiveButtons(
        minimizedEmbed,
        expandedEmbed,
        interaction
      );
    };
  }

  createBaseEmbed(
    osuUser: IOsuUser<any>,
    runner: IFurudeRunner<OsuContext>
  ): BaseEmbed {
    return new BaseEmbed(
      {
        author: this.getUserInfoAuthor(osuUser, runner),
      },
      runner.interaction
    ).setThumbnail(osuUser.getAvatarUrl());
  }

  createMinimizedEmbed(
    osuUser: IOsuUser<any>,
    runner: IFurudeRunner<OsuContext>
  ): BaseEmbed {
    return this.createBaseEmbed(osuUser, runner).setDescription(
      `Accuracy: ${`${MessageCreator.block(
        osuUser.accuracy.toFixed(2)
      )}%`} • Level: ${MessageCreator.block(
        osuUser.level.toFixed(2)
      )}\nPlaycount: ${MessageCreator.block(
        osuUser.counts.plays.toLocaleString(runner.args!.localizer.language)
      )} (${secondsToHours(osuUser.total_seconds_played)} hrs)`
    );
  }

  createExpandedEmbed(
    osuUser: IOsuUser<any>,
    runner: IFurudeRunner<OsuContext>
  ): BaseEmbed {
    return this.createBaseEmbed(osuUser, runner)
      .setDescription(MessageCreator.bold('osu! statistics:'))
      .addFields([
        {
          name: 'Ranked score',
          value: osuUser.scores.ranked.toLocaleString(
            runner.args!.localizer.language
          ),
        },
        {
          name: 'Accuracy',
          value: osuUser.accuracy.toFixed(2),
        },
        {
          name: 'Total score',
          value: osuUser.scores.total.toLocaleString(
            runner.args!.localizer.language
          ),
        },
        { name: 'Level', value: osuUser.level.toFixed(2) },
        {
          name: 'Play count / Time',
          value: `${osuUser.counts.plays.toLocaleString(
            runner.args!.localizer.language
          )} / ${secondsToHours(osuUser.total_seconds_played)}`,
        },
      ]);
  }
}
