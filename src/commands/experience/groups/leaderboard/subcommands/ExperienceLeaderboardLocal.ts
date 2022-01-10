import DefaultContext from '../../../../../client/contexts/DefaultContext';
import GenericNames from '../../../../../containers/GenericNames';
import DBUser from '../../../../../database/entity/DBUser';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
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
    runner: IFurudeRunner<DefaultContext>,
    user: DBUser
  ): number | null {
    return user.experience.currentLocal(runner.interaction.guild!);
  }

  public async getUsers(
    runner: IFurudeRunner<DefaultContext>
  ): Promise<DBUser[]> {
    return await runner.args!.db.USER.getAllOn({
      where: {
        'experience.locals': {
          $elemMatch: { key: runner.interaction.guildId! },
        },
      },
    });
  }
}
