import type OsuContext from '../../../../../client/contexts/osu/OsuContext';
import Strings from '../../../../../containers/Strings';
import ExpandableEmbedHelper from '../../../../../discord/commands/helpers/ExpandableEmbedHelper';
import type IHasExpandableEmbed from '../../../../../discord/commands/interfaces/IHasExpandableEmbed';
import type { TypedArgs } from '../../../../../modules/framework/commands/decorators/ContextDecorators';
import { MessageButtonCreator } from '../../../../../modules/framework/creators/MessageButtonCreator';
import BaseEmbed from '../../../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../../../modules/framework/interactions/InteractionUtils';
import { assertDefined } from '../../../../../modules/framework/types/TypeAssertions';
import type IOsuScore from '../../../../../modules/osu/scores/IOsuScore';
import type IOsuUser from '../../../../../modules/osu/users/IOsuUser';
import type { OsuServerUserOptionWithDiscord } from '../../../wrapper/OsuSubCommand';
import OsuSubCommand from '../../../wrapper/OsuSubCommand';

type Args = unknown & OsuServerUserOptionWithDiscord;
export default class OsuRecentScore
  extends OsuSubCommand<Args>
  implements IHasExpandableEmbed
{
  static #SCORES_PER_PAGE = 5;

  public createArgs(): Args {
    return {
      ...((): OsuServerUserOptionWithDiscord => {
        const args = this.getOsuServerOptionsWithDiscordUser();
        args.server.setDescription('The server of the score you want to view.');
        args.username.setDescription('The user who did that amazing score.');
        args.discordUser.setDescription(
          'The discord user who did that amazing thing.'
        );
        return args;
      })(),
    };
  }

  public constructor() {
    super({
      name: 'score',
      description: 'Views a osu! recent score.',
    });
  }

  public async trigger(context: OsuContext<TypedArgs<Args>>): Promise<void> {
    const { interaction, client, args } = context;
    const { discordUser } = args;

    assertDefined(discordUser);

    const osuUser = await this.getUserFromServer(context, discordUser);

    if (!osuUser) {
      await this.sendOsuUserNotFound(context);
      return;
    }
    const recentScores = await this.getUserRecentFromServer(osuUser, false);
    const recentScore = recentScores[0];

    if (!recentScore) {
      await InteractionUtils.reply(
        interaction,
        MessageCreator.error(
          "I couldn't find any recent scores from said user."
        )
      );
      return;
    }

    await client.beatmapCache.fetchFromScore(recentScore);

    let expandedEmbed = new BaseEmbed();
    const minimizedEmbed = this.createMinimizedEmbed(
      context,
      osuUser,
      recentScore
    );

    await ExpandableEmbedHelper.createExpandingInteractiveButton(
      minimizedEmbed,
      expandedEmbed,
      interaction,
      {},
      {
        onExpand: async () => {
          await MessageButtonCreator.createLimitedButtonBasedPaging(
            interaction,
            {},
            [interaction.user.id],
            recentScores,
            OsuRecentScore.#SCORES_PER_PAGE,
            1,
            60,
            async (options, page) => {
              const scores: IOsuScore[] = [];
              await MessageButtonCreator.loopPages(
                OsuRecentScore.#SCORES_PER_PAGE,
                page,
                recentScores,
                async (i) => {
                  const score = recentScores[i];
                  if (score) {
                    await client.beatmapCache.fetchFromScore(score);
                    scores.push(score);
                  }
                }
              );
              expandedEmbed = this.createExpandedEmbed(
                context,
                osuUser,
                scores,
                page
              );
              options.embeds = [expandedEmbed];
            }
          );
        },
      }
    );
  }

  public createBaseEmbed(
    context: OsuContext<TypedArgs<Args>>,
    user: IOsuUser<unknown>
  ): BaseEmbed {
    const { interaction } = context;
    return new BaseEmbed(
      {
        author: this.getUserInfoAuthor(user, context),
      },
      interaction
    );
  }

  public createMinimizedEmbed(
    context: OsuContext<TypedArgs<Args>>,
    user: IOsuUser<unknown>,
    score: IOsuScore
  ): BaseEmbed {
    const embed = this.createBaseEmbed(context, user).setDescription(
      this.#createMinimizedDescription(score, context)
    );

    if (score.apiBeatmap) {
      embed.setThumbnail(score.apiBeatmap.getCoverThumbnail());
    }

    return embed;
  }

  public createExpandedEmbed(
    context: OsuContext<TypedArgs<Args>>,
    user: IOsuUser<unknown>,
    scores: IOsuScore[],
    page: number
  ): BaseEmbed {
    const embed = this.createBaseEmbed(context, user);
    embed.description = Strings.EMPTY;
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];

      assertDefined(score);

      if (i > 0) {
        embed.description = MessageCreator.breakLine(embed.description);
      }

      embed.description +=
        MessageCreator.bold(
          `${
            MessageButtonCreator.getPageContentIndex(
              i,
              OsuRecentScore.#SCORES_PER_PAGE,
              page
            ) + 1
          }.`
        ) + ' ';

      embed.description += this.#createMinimizedDescription(score, context);
    }
    return embed;
  }

  #createMinimizedDescription(
    score: IOsuScore,
    context: OsuContext<TypedArgs<Args>>
  ): string {
    const { apiBeatmap } = score;
    const { localizer } = context;
    const { Language } = localizer;

    let string = Strings.EMPTY;
    let canHyperLink = false;

    if (apiBeatmap) {
      string += `${apiBeatmap.title} [${apiBeatmap.version}]`;
      if (apiBeatmap.beatmapID) {
        canHyperLink = true;
        string = MessageCreator.bold(
          MessageCreator.hyperLink(string, apiBeatmap.getPageUrl())
        );
      }
    } else {
      string += `NOT FOUND`;
    }

    if (!canHyperLink) {
      string = MessageCreator.block(string);
    }

    string = MessageCreator.breakLine(string);

    string += `▸ ${score.score.toLocaleString(Language)} ▸ x${
      score.counts.combo
    } ▸ [${score.counts[300]}/${score.counts[100]}/${score.counts[50]}/${
      score.counts.misses
    }]`;

    string = MessageCreator.breakLine(string);

    string += `▸ Score Set ${MessageCreator.timeStamp(score.date)}`;

    return string;
  }
}
