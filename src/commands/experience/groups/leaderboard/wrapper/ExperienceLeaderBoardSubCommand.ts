import type DefaultContext from '../../../../../contexts/DefaultContext';
import CommandOptions from '../../../../../containers/CommandOptions';
import type DBUser from '../../../../../database/entity/discord/user/DBUser';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import { MessageButtonCreator } from '../../../../../discord/creators/MessageButtonCreator';
import { PageOption } from 'discowork';
import ArrayUtils from '../../../../../utils/ArrayUtils';

export type LeaderboardArgs = {
  page: PageOption;
};

export default abstract class ExperienceLeaderboardSubCommand extends FurudeSubCommand<
  LeaderboardArgs,
  DefaultContext<LeaderboardArgs>
> {
  public createArguments(): LeaderboardArgs {
    return {
      page: new PageOption(10)
        .setName(CommandOptions.page)
        .setDescription('The page you want to start the leaderboard from.'),
    };
  }

  public async trigger(
    context: DefaultContext<LeaderboardArgs>
  ): Promise<void> {
    const { interaction, client, args } = context;
    const { page } = args;
    const { localizer } = client;

    const users = ArrayUtils.greatestToLowest(
      await this.getUsers(context),
      (item) => this.getAppliedExperienceFromUser(context, item)
    );

    await MessageButtonCreator.createButtonBasedTable(
      interaction,
      {},
      [interaction.user.id],
      users,
      page,
      60,
      [{ name: 'Username' }, { name: 'Experience' }],
      (item) => {
        return [
          item.username,
          (this.getAppliedExperienceFromUser(context, item) ?? 0).toString(),
        ];
      },
      localizer.getTranslationFromContext(
        context,
        (s) => s.errors.nothing_here,
        {}
      )
    );
  }

  public abstract getUsers(
    context: DefaultContext<LeaderboardArgs>
  ): Promise<DBUser[]>;

  public abstract getAppliedExperienceFromUser(
    context: DefaultContext<LeaderboardArgs>,
    user: DBUser
  ): number | null;
}
