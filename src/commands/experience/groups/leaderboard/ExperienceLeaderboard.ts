import { CommandInformation } from 'discowork/src/commands/decorators';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';

@CommandPreconditions(Preconditions.RequiresSubCommand)
@CommandInformation({
  name: 'leaderboard',
  description: '.',
})
export default class ExperienceLeaderboard extends FurudeCommandGroup {
  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
