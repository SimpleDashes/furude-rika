import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import type DefaultContext from '../../../../../contexts/DefaultContext';
import type DBUser from '../../../../../database/entity/discord/user/DBUser';
import type { LeaderboardArgs } from '../wrapper/ExperienceLeaderBoardSubCommand';
import ExperienceLeaderboardSubCommand from '../wrapper/ExperienceLeaderBoardSubCommand';

@CommandInformation({
  name: 'global',
  description:
    'Get the global xp leaderboard. will you be able to grind to the top.',
})
export default class ExperienceLeaderboardGlobal extends ExperienceLeaderboardSubCommand {
  public getAppliedExperienceFromUser(
    _context: DefaultContext<LeaderboardArgs>,
    user: DBUser
  ): number | null {
    return user.experience.global;
  }

  public async getUsers(
    context: DefaultContext<LeaderboardArgs>
  ): Promise<DBUser[]> {
    return await context.db.USER.find();
  }
}
