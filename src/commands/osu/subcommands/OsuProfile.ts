import { secondsToHours } from 'date-fns';
import { CommandInformation } from 'discowork/src/commands/decorators';
import type OsuContext from '../../../contexts/osu/OsuContext';
import ExpandableEmbedHelper from '../../../discord/commands/helpers/ExpandableEmbedHelper';
import type IHasExpandableEmbed from '../../../discord/commands/interfaces/IHasExpandableEmbed';
import type { FurudeLanguages } from '../../../localization/FurudeLocalizer';
import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import type IOsuUser from '../../../modules/osu/users/IOsuUser';
import type { OsuServerUserOptionWithDiscord } from '../wrapper/OsuSubCommand';
import OsuSubCommand from '../wrapper/OsuSubCommand';

type Args = unknown & OsuServerUserOptionWithDiscord;

@CommandInformation({
  name: 'profile',
  description: 'Views a user osu! profile.',
})
export default class OsuProfile
  extends OsuSubCommand<Args>
  implements IHasExpandableEmbed
{
  public createArguments(): Args {
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

  public async trigger(context: OsuContext<Args>): Promise<void> {
    const { interaction, args, client } = context;
    const { localizer } = client;
    const { discordUser } = args;

    const osuUser = await this.getUserFromServer(context, discordUser);

    if (!osuUser) {
      await this.sendOsuUserNotFound(context);
      return;
    }

    const language = localizer.getLanguageFromContext(context);

    const expandedEmbed = this.createExpandedEmbed(osuUser, context, language);
    const minimizedEmbed = this.createMinimizedEmbed(
      osuUser,
      context,
      language
    );

    await ExpandableEmbedHelper.createInteractiveButtons(
      minimizedEmbed,
      expandedEmbed,
      interaction
    );
  }

  public createBaseEmbed(
    osuUser: IOsuUser<unknown>,
    context: OsuContext<Args>
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
    context: OsuContext<Args>,
    language: FurudeLanguages
  ): BaseEmbed {
    return this.createBaseEmbed(osuUser, context).setDescription(
      `Accuracy: ${`${MessageCreator.block(
        osuUser.accuracy.toFixed(2)
      )}%`} • Level: ${MessageCreator.block(
        osuUser.level.toFixed(2)
      )}\nPlaycount: ${MessageCreator.block(
        osuUser.counts.plays.toLocaleString(language)
      )} (${secondsToHours(osuUser.total_seconds_played)} hrs)`
    );
  }

  public createExpandedEmbed(
    osuUser: IOsuUser<unknown>,
    context: OsuContext<Args>,
    language: FurudeLanguages
  ): BaseEmbed {
    return this.createBaseEmbed(osuUser, context)
      .setDescription(MessageCreator.bold('osu! statistics:'))
      .addFields([
        {
          name: 'Ranked score',
          value: osuUser.scores.ranked.toLocaleString(language),
        },
        {
          name: 'Accuracy',
          value: osuUser.accuracy.toFixed(2),
        },
        {
          name: 'Total score',
          value: osuUser.scores.total.toLocaleString(language),
        },
        { name: 'Level', value: osuUser.level.toFixed(2) },
        {
          name: 'Play count / Time',
          value: `${osuUser.counts.plays.toLocaleString(
            language
          )} / ${secondsToHours(osuUser.total_seconds_played)}`,
        },
      ]);
  }
}
