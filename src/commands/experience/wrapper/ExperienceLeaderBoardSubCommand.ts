import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeRika from '../../../client/FurudeRika';
import CommandOptions from '../../../containers/CommandOptions';
import DBUser from '../../../database/entity/DBUser';
import FurudeButtonCreator from '../../../discord/buttons/FurudeButtonCreator';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import ArrayHelper from '../../../framework/helpers/ArrayHelper';
import PageOption from '../../../framework/options/custom/PageOption';

export default abstract class ExperienceLeaderboardSubCommand extends FurudeSubCommand {
  private pageOption = this.registerOption(
    new PageOption(10)
      .setName(CommandOptions.page)
      .setDescription('The page you want to start the leaderboard from.')
  );

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const users = ArrayHelper.greatestToLowest(
        await this.getUsers(runner),
        (item) => this.getAppliedExperienceFromUser(runner, item)
      );

      await FurudeButtonCreator.createButtonBasedTable(
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
            (this.getAppliedExperienceFromUser(runner, item) ?? 0).toString(),
          ];
        }
      );
    };
  }

  public abstract getUsers(
    runner: IFurudeRunner<DefaultContext>
  ): Promise<DBUser[]>;

  public abstract getAppliedExperienceFromUser(
    runner: IFurudeRunner<DefaultContext>,
    user: DBUser
  ): number | null;
}
