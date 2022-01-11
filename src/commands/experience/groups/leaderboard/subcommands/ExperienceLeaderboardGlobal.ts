import DefaultContext from '../../../../../client/contexts/DefaultContext';
import GenericNames from '../../../../../containers/GenericNames';
import DBUser from '../../../../../database/entity/DBUser';
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
    _context: DefaultContext,
    user: DBUser
  ): number | null {
    return user.experience.global;
  }

  public async getUsers(context: DefaultContext): Promise<DBUser[]> {
    return await context.db.USER.getAllOn();
  }
}
