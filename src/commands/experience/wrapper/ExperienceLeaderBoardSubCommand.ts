import type DefaultContext from '../../../client/contexts/DefaultContext';
import CommandOptions from '../../../containers/CommandOptions';
import type DBUser from '../../../database/entity/DBUser';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import type { TypedArgs } from '../../../modules/framework/commands/decorators/ContextDecorators';
import { MessageButtonCreator } from '../../../modules/framework/creators/MessageButtonCreator';
import ArrayHelper from '../../../modules/framework/helpers/ArrayHelper';
import PageOption from '../../../modules/framework/options/custom/PageOption';

export type LeaderboardArgs = {
  page: PageOption;
};
export default abstract class ExperienceLeaderboardSubCommand extends FurudeSubCommand<
  DefaultContext<TypedArgs<LeaderboardArgs>>,
  LeaderboardArgs
> {
  public createArgs(): LeaderboardArgs {
    return {
      page: new PageOption(10)
        .setName(CommandOptions.page)
        .setDescription('The page you want to start the leaderboard from.'),
    };
  }

  public async trigger(
    context: DefaultContext<TypedArgs<LeaderboardArgs>>
  ): Promise<void> {
    const { interaction, args } = context;
    const { page } = args;

    const users = ArrayHelper.greatestToLowest(
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
      }
    );
  }

  public abstract getUsers(
    context: DefaultContext<TypedArgs<LeaderboardArgs>>
  ): Promise<DBUser[]>;

  public abstract getAppliedExperienceFromUser(
    context: DefaultContext<TypedArgs<LeaderboardArgs>>,
    user: DBUser
  ): number | null;
}
