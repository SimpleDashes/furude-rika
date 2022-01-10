import { CommandInteraction, CacheType } from 'discord.js';
import OsuContext from '../../../../../client/contexts/osu/OsuContext';
import FurudeRika from '../../../../../client/FurudeRika';
import Strings from '../../../../../containers/Strings';
import ExpandableEmbedHelper from '../../../../../discord/commands/helpers/ExpandableEmbedHelper';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import IHasExpandableEmbed from '../../../../../discord/commands/interfaces/IHasExpandableEmbed';
import { MessageButtonCreator } from '../../../../../modules/framework/creators/MessageButtonCreator';
import BaseEmbed from '../../../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../../../modules/framework/interactions/InteractionUtils';
import IOsuScore from '../../../../../modules/osu/scores/IOsuScore';
import IOsuUser from '../../../../../modules/osu/users/IOsuUser';
import OsuSubCommand from '../../../wrapper/OsuSubCommand';

export default class OsuRecentScore
  extends OsuSubCommand
  implements IHasExpandableEmbed
{
  private static SCORES_PER_PAGE = 5;

  private serverUserOptions = this.registerServerUserOptions(this, (o) => {
    o.server.setDescription('The server of the score you want to view.');
    o.user.setDescription('The user who did that amazing score.');
  });

  private discordUserOption = this.registerDiscordUserOption(
    this
  ).setDescription('The discord user who did that amazing thing.');

  constructor() {
    super({
      name: 'score',
      description: 'Views a osu! recent score.',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<OsuContext>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const server = this.applyToServerOption(
        this.serverUserOptions.server,
        interaction
      );

      const osuUser = await this.getUserFromServer(
        server,
        runner,
        this.serverUserOptions.user.apply(interaction),
        this.discordUserOption.apply(interaction)!
      );

      if (!osuUser) {
        await this.sendOsuUserNotFound(runner);
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
        runner,
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
              OsuRecentScore.SCORES_PER_PAGE,
              1,
              60,
              async (options, page, _content) => {
                const scores: IOsuScore[] = [];
                await MessageButtonCreator.loopPages(
                  OsuRecentScore.SCORES_PER_PAGE,
                  page,
                  async (i) => {
                    const score = recentScores[i];
                    if (score) {
                      await client.beatmapCache.fetchFromScore(score);
                      scores.push(score);
                    }
                  }
                );
                expandedEmbed = this.createExpandedEmbed(
                  runner,
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
    };
  }

  createBaseEmbed(
    runner: IFurudeRunner<OsuContext>,
    user: IOsuUser<unknown>
  ): BaseEmbed {
    return new BaseEmbed(
      {
        author: this.getUserInfoAuthor(user, runner),
      },
      runner.interaction
    );
  }

  createMinimizedEmbed(
    runner: IFurudeRunner<OsuContext>,
    user: IOsuUser<unknown>,
    score: IOsuScore
  ): BaseEmbed {
    const embed = this.createBaseEmbed(runner, user).setDescription(
      this.createMinimizedDescription(score, runner)
    );

    if (score.apiBeatmap) {
      embed.setThumbnail(score.apiBeatmap.getCoverThumbnail());
    }

    return embed;
  }

  createExpandedEmbed(
    runner: IFurudeRunner<OsuContext>,
    user: IOsuUser<unknown>,
    scores: IOsuScore[],
    page: number
  ): BaseEmbed {
    const embed = this.createBaseEmbed(runner, user);
    embed.description = Strings.EMPTY;
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i]!;
      if (i > 0) {
        embed.description = MessageCreator.breakLine(embed.description!);
      }
      embed.description +=
        MessageCreator.bold(
          `${
            MessageButtonCreator.getPageContentIndex(
              i,
              OsuRecentScore.SCORES_PER_PAGE,
              page
            ) + 1
          }.`
        ) + ' ';
      embed.description += this.createMinimizedDescription(score, runner);
    }
    return embed;
  }

  private createMinimizedDescription(
    score: IOsuScore,
    runner: IFurudeRunner<OsuContext>
  ): string {
    const { apiBeatmap } = score;
    const { language } = runner.args!.localizer;
    let string = Strings.EMPTY;
    let canHyperLink: boolean = false;
    if (apiBeatmap) {
      string += `${apiBeatmap.title} [${apiBeatmap.version}]`;
      if (!!apiBeatmap.beatmapID) {
        canHyperLink = true;
      }
    } else {
      string += `NOT FOUND`;
    }
    string = canHyperLink
      ? MessageCreator.bold(
          MessageCreator.hyperLink(string, apiBeatmap!.getPageUrl())
        )
      : MessageCreator.block(string);
    string = MessageCreator.breakLine(string);
    string += `▸ ${score.score.toLocaleString(language)} ▸ x${
      score.counts.combo
    } ▸ [${score.counts[300]}/${score.counts[100]}/${score.counts[50]}/${
      score.counts.misses
    }]`;
    string = MessageCreator.breakLine(string);
    string += `▸ Score Set ${MessageCreator.timeStamp(score.date)}`;
    return string;
  }
}
