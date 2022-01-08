import { CommandInteraction, CacheType } from 'discord.js';
import OsuContext from '../../../../../client/contexts/osu/OsuContext';
import FurudeRika from '../../../../../client/FurudeRika';
import ExpandableEmbedHelper from '../../../../../discord/commands/helpers/ExpandableEmbedHelper';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import IHasExpandableEmbed from '../../../../../discord/commands/interfaces/IHasExpandableEmbed';
import { MessageButtonCreator } from '../../../../../modules/framework/creators/MessageButtonCreator';
import BaseEmbed from '../../../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../../../modules/framework/interactions/InteractionUtils';
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
    _client: FurudeRika,
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
        undefined,
        this.discordUserOption.apply(interaction)!
      );

      if (!osuUser) {
        await this.sendOsuUserNotFound(runner);
        return;
      }

      const recentScores = await this.getUserRecentFromServer(server, osuUser);
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

      let expandedEmbed = this.createExpandedEmbed(runner);
      const minimizedEmbed = this.createMinimizedEmbed(runner);

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
                MessageButtonCreator.loopPages(
                  OsuRecentScore.SCORES_PER_PAGE,
                  page,
                  () => {
                    expandedEmbed = this.createExpandedEmbed(runner);
                    options.embeds = [expandedEmbed];
                  }
                );
              }
            );
          },
        }
      );
    };
  }

  createBaseEmbed(runner: IFurudeRunner<OsuContext>): BaseEmbed {
    return new BaseEmbed({}, runner.interaction).setDescription('UNFINISHED');
  }

  createMinimizedEmbed(runner: IFurudeRunner<OsuContext>): BaseEmbed {
    return this.createBaseEmbed(runner);
  }

  createExpandedEmbed(runner: IFurudeRunner<OsuContext>): BaseEmbed {
    return this.createBaseEmbed(runner);
  }
}
