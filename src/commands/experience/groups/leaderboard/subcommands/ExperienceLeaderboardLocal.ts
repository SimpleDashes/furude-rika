import type DefaultContext from '../../../../../client/contexts/DefaultContext';
import GenericNames from '../../../../../containers/GenericNames';
import type DBUser from '../../../../../database/entity/DBUser';
import type { TypedArgs } from '../../../../../modules/framework/commands/contexts/types';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/preconditions/PreconditionDecorators';
import { assertDefined } from '../../../../../modules/framework/types/TypeAssertions';
import type { LeaderboardArgs } from '../../../wrapper/ExperienceLeaderBoardSubCommand';
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
    context: DefaultContext<TypedArgs<LeaderboardArgs>>,
    user: DBUser
  ): number | null {
    assertDefined(context.interaction.guild);
    return user.experience.currentLocal(context.interaction.guild);
  }

  public async getUsers(
    context: DefaultContext<TypedArgs<LeaderboardArgs>>
  ): Promise<DBUser[]> {
    assertDefined(context.interaction.guildId);
    return await context.db.USER.find({
      where: {
        'experience.locals': {
          $elemMatch: { key: context.interaction.guildId },
        },
      },
    });
  }
}
