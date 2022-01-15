import { secondsToHours } from 'date-fns';
import type OsuContext from '../../../client/contexts/osu/OsuContext';
import ExpandableEmbedHelper from '../../../discord/commands/helpers/ExpandableEmbedHelper';
import type IHasExpandableEmbed from '../../../discord/commands/interfaces/IHasExpandableEmbed';
import type { TypedArgs } from '../../../modules/framework/commands/contexts/types';
import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import type IOsuUser from '../../../modules/osu/users/IOsuUser';
import type { OsuServerUserOptionWithDiscord } from '../wrapper/OsuSubCommand';
import OsuSubCommand from '../wrapper/OsuSubCommand';

type Args = unknown & OsuServerUserOptionWithDiscord;
export default class OsuProfile
  extends OsuSubCommand<Args>
  implements IHasExpandableEmbed
{
  public createArgs(): Args {
    return {
      ...((): OsuServerUserOptionWithDiscord => {
        const args = this.getOsuServerOptionsWithDiscordUser();
        args.server.setDescription(
          'The server of the account you want to view.'
        );
        args.username.setDescription(
          'The username of the account you want to view.'
        );
        args.discordUser.setDescription(
          'The user who owns the account you want to view.'
        );
        return args;
      })(),
    };
  }

  public constructor() {
    super({
      name: 'profile',
      description: 'Views a user osu! profile.',
    });
  }

  public async trigger(context: OsuContext<TypedArgs<Args>>): Promise<void> {
    const { interaction, args } = context;
    const { discordUser } = args;

    const osuUser = await this.getUserFromServer(context, discordUser);

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

  public createBaseEmbed(
    osuUser: IOsuUser<unknown>,
    context: OsuContext<TypedArgs<Args>>
  ): BaseEmbed {
    return new BaseEmbed(
      {
        author: this.getUserInfoAuthor(osuUser, context),
      },
      context.interaction
    ).setThumbnail(osuUser.getAvatarUrl());
  }

  public createMinimizedEmbed(
    osuUser: IOsuUser<unknown>,
    context: OsuContext<TypedArgs<Args>>
  ): BaseEmbed {
    const { localizer } = context;
    return this.createBaseEmbed(osuUser, context).setDescription(
      `Accuracy: ${`${MessageCreator.block(
        osuUser.accuracy.toFixed(2)
      )}%`} • Level: ${MessageCreator.block(
        osuUser.level.toFixed(2)
      )}\nPlaycount: ${MessageCreator.block(
        osuUser.counts.plays.toLocaleString(localizer.Language)
      )} (${secondsToHours(osuUser.total_seconds_played)} hrs)`
    );
  }

  public createExpandedEmbed(
    osuUser: IOsuUser<unknown>,
    context: OsuContext<TypedArgs<Args>>
  ): BaseEmbed {
    const { localizer } = context;
    return this.createBaseEmbed(osuUser, context)
      .setDescription(MessageCreator.bold('osu! statistics:'))
      .addFields([
        {
          name: 'Ranked score',
          value: osuUser.scores.ranked.toLocaleString(localizer.Language),
        },
        {
          name: 'Accuracy',
          value: osuUser.accuracy.toFixed(2),
        },
        {
          name: 'Total score',
          value: osuUser.scores.total.toLocaleString(localizer.Language),
        },
        { name: 'Level', value: osuUser.level.toFixed(2) },
        {
          name: 'Play count / Time',
          value: `${osuUser.counts.plays.toLocaleString(
            localizer.Language
          )} / ${secondsToHours(osuUser.total_seconds_played)}`,
        },
      ]);
  }
}
