import DefaultContext from '../../../client/contexts/DefaultContext';
import CommandOptions from '../../../containers/CommandOptions';
import DBUser from '../../../database/entity/DBUser';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import { MessageButtonCreator } from '../../../modules/framework/creators/MessageButtonCreator';
import ArrayHelper from '../../../modules/framework/helpers/ArrayHelper';
import PageOption from '../../../modules/framework/options/custom/PageOption';

export default abstract class ExperienceLeaderboardSubCommand extends FurudeSubCommand {
  private pageOption = this.registerOption(
    new PageOption(10)
      .setName(CommandOptions.page)
      .setDescription('The page you want to start the leaderboard from.')
  );

  public async trigger(context: DefaultContext): Promise<void> {
    const { interaction } = context;

    const users = ArrayHelper.greatestToLowest(
      await this.getUsers(context),
      (item) => this.getAppliedExperienceFromUser(context, item)
    );

    await MessageButtonCreator.createButtonBasedTable(
      interaction,
      {},
      [interaction.user.id],
      users,
      this.pageOption,
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

  public abstract getUsers(context: DefaultContext): Promise<DBUser[]>;

  public abstract getAppliedExperienceFromUser(
    context: DefaultContext,
    user: DBUser
  ): number | null;
}
