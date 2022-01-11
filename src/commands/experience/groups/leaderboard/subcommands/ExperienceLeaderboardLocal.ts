import DefaultContext from '../../../../../client/contexts/DefaultContext';
import GenericNames from '../../../../../containers/GenericNames';
import DBUser from '../../../../../database/entity/DBUser';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/commands/decorators/PreconditionDecorators';
import ExperienceLeaderboardSubCommand from '../../../wrapper/ExperienceLeaderBoardSubCommand';

@SetPreconditions(Preconditions.GuildOnly)
export default class ExperienceLeaderboardLocal extends ExperienceLeaderboardSubCommand {
  public constructor() {
    super({
      name: GenericNames.local,
      description:
        'Get the local xp leaderboard. will you be able to grind to the top.',
    });
  }

  public getAppliedExperienceFromUser(
    context: DefaultContext,
    user: DBUser
  ): number | null {
    return user.experience.currentLocal(context.interaction.guild!);
  }

  public async getUsers(context: DefaultContext): Promise<DBUser[]> {
    return await context.db.USER.getAllOn({
      where: {
        'experience.locals': {
          $elemMatch: { key: context.interaction.guildId! },
        },
      },
    });
  }
}
