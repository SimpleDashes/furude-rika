import DefaultContext from '../../../../../client/contexts/DefaultContext';
import GenericNames from '../../../../../containers/GenericNames';
import DBUser from '../../../../../database/entity/DBUser';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import { RequiresGuild } from '../../../../../framework/commands/decorators/PreconditionDecorators';
import ExperienceLeaderboardSubCommand from '../../../wrapper/ExperienceLeaderBoardSubCommand';
import _ from 'lodash';

@RequiresGuild
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
    // TODO: ACTUALLY DO A QUERY TO GET ONLY THE GUILD THE USER IS IN
    // I couldn't find a method on typeorm for that (That works with mongodb)
    // so i probably should migrate to other orm.
    return (await runner.args!.db.USER.getAllOn()).filter((u) =>
      u.experience.locals.find((e) => e.key == runner.interaction.guildId!)
    );
  }
}
