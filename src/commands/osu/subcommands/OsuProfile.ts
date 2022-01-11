import { secondsToHours } from 'date-fns';
import OsuContext from '../../../client/contexts/osu/OsuContext';
import ExpandableEmbedHelper from '../../../discord/commands/helpers/ExpandableEmbedHelper';
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

  public async trigger(context: OsuContext): Promise<void> {
    const { interaction } = context;

    const osuUser = await this.getUserFromServerUserOptions(
      this.serverUserOptions,
      context,
      this.discordUserOption.apply(interaction)
    );

    if (!osuUser) {
      await this.sendOsuUserNotFound(context);
      return;
    }

    const expandedEmbed = this.createExpandedEmbed(osuUser, context);
    const minimizedEmbed = this.createMinimizedEmbed(osuUser, context);

    await ExpandableEmbedHelper.createInteractiveButtons(
      minimizedEmbed,
      expandedEmbed,
      interaction
    );
  }

  createBaseEmbed(osuUser: IOsuUser<unknown>, context: OsuContext): BaseEmbed {
    return new BaseEmbed(
      {
        author: this.getUserInfoAuthor(osuUser, context),
      },
      context.interaction
    ).setThumbnail(osuUser.getAvatarUrl());
  }

  createMinimizedEmbed(
    osuUser: IOsuUser<unknown>,
    context: OsuContext
  ): BaseEmbed {
    const { localizer } = context;
    return this.createBaseEmbed(osuUser, context).setDescription(
      `Accuracy: ${`${MessageCreator.block(
        osuUser.accuracy.toFixed(2)
      )}%`} • Level: ${MessageCreator.block(
        osuUser.level.toFixed(2)
      )}\nPlaycount: ${MessageCreator.block(
        osuUser.counts.plays.toLocaleString(localizer.language)
      )} (${secondsToHours(osuUser.total_seconds_played)} hrs)`
    );
  }

  createExpandedEmbed(
    osuUser: IOsuUser<unknown>,
    context: OsuContext
  ): BaseEmbed {
    const { localizer } = context;
    return this.createBaseEmbed(osuUser, context)
      .setDescription(MessageCreator.bold('osu! statistics:'))
      .addFields([
        {
          name: 'Ranked score',
          value: osuUser.scores.ranked.toLocaleString(localizer.language),
        },
        {
          name: 'Accuracy',
          value: osuUser.accuracy.toFixed(2),
        },
        {
          name: 'Total score',
          value: osuUser.scores.total.toLocaleString(localizer.language),
        },
        { name: 'Level', value: osuUser.level.toFixed(2) },
        {
          name: 'Play count / Time',
          value: `${osuUser.counts.plays.toLocaleString(
            localizer.language
          )} / ${secondsToHours(osuUser.total_seconds_played)}`,
        },
      ]);
  }
}
