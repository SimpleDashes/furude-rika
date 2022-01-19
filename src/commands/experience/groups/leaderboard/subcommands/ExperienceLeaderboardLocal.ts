import type DefaultContext from '../../../../../contexts/DefaultContext';
import GenericNames from '../../../../../containers/GenericNames';
import type DBUser from '../../../../../database/entity/DBUser';
import type { LeaderboardArgs } from '../../../wrapper/ExperienceLeaderBoardSubCommand';
import ExperienceLeaderboardSubCommand from '../../../wrapper/ExperienceLeaderBoardSubCommand';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import type { TypedArgs } from 'discowork/src/contexts/TypedArgs';
import { CommandInformation } from 'discowork/src/commands/decorators';
import { assertDefined } from 'discowork/src/assertions';

@CommandPreconditions(Preconditions.GuildOnly)
@CommandInformation({
  name: GenericNames.local,
  description:
    'Get the local xp leaderboard. will you be able to grind to the top.',
})
export default class ExperienceLeaderboardLocal extends ExperienceLeaderboardSubCommand {
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
