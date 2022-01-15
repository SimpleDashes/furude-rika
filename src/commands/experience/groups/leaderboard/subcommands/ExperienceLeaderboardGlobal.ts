import type DefaultContext from '../../../../../client/contexts/DefaultContext';
import GenericNames from '../../../../../containers/GenericNames';
import type DBUser from '../../../../../database/entity/DBUser';
import type { TypedArgs } from '../../../../../modules/framework/commands/contexts/types';
import type { LeaderboardArgs } from '../../../wrapper/ExperienceLeaderBoardSubCommand';
import ExperienceLeaderboardSubCommand from '../../../wrapper/ExperienceLeaderBoardSubCommand';

export default class ExperienceLeaderboardGlobal extends ExperienceLeaderboardSubCommand {
  public constructor() {
    super({
      name: GenericNames.global,
      description:
        'Get the global xp leaderboard. will you be able to grind to the top.',
    });
  }

  public getAppliedExperienceFromUser(
    _context: DefaultContext<TypedArgs<LeaderboardArgs>>,
    user: DBUser
  ): number | null {
    return user.experience.global;
  }

  public async getUsers(
    context: DefaultContext<TypedArgs<LeaderboardArgs>>
  ): Promise<DBUser[]> {
    return await context.db.USER.find();
  }
}
